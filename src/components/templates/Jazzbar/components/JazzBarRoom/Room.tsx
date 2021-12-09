import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import Bugsnag from "@bugsnag/js";
import Video from "twilio-video";

import { getTwilioVideoToken } from "api/video";

import { User } from "types/User";

import { stopLocalTrack } from "utils/twilio";

import { useWorldUsersById } from "hooks/users";
import { useUser } from "hooks/useUser";

import LocalParticipant from "components/organisms/Room/LocalParticipant";
import Participant from "components/organisms/Room/Participant";
import VideoErrorModal from "components/organisms/Room/VideoErrorModal";

import "./Room.scss";

const NUM_OF_SIDED_USERS_MINUS_ONE = 3;

interface RoomProps {
  roomName: string;
  venueName: string;
  setUserList: (val: User[]) => void;
  setParticipantCount?: (val: number) => void;
  setSeatedAtTable?: (val: string) => void;
  onBack?: () => void;
  hasChairs?: boolean;
  defaultMute?: boolean;
  isAudioEffectDisabled: boolean;
}

// @debt THIS COMPONENT IS THE COPY OF components/molecules/TableComponent
// The reason to copy it was the lack of time to refactor the whole thing, so the
// safest approch (not to break other Venues that rely on TableComponent) is to copy this component
// It needs to get deleted in the future
const Room: React.FC<RoomProps> = ({
  roomName,
  venueName,
  setUserList,
  setParticipantCount,
  setSeatedAtTable,
  hasChairs = true,
  defaultMute,
  isAudioEffectDisabled,
}) => {
  const [room, setRoom] = useState<Video.Room>();
  const [videoError, setVideoError] = useState<string>("");
  const [participants, setParticipants] = useState<Array<Video.Participant>>(
    []
  );

  const { user, profile } = useUser();
  const { worldUsersById } = useWorldUsersById();
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  useEffect(
    () => setParticipantCount && setParticipantCount(participants.length),
    [participants.length, setParticipantCount]
  );

  // @debt refactor this to use useAsync or similar?
  useEffect(() => {
    if (!user) return;

    getTwilioVideoToken({
      userId: user.uid,
      roomName,
    }).then(setToken);
  }, [firebase, roomName, user]);

  useEffect(() => {
    return () => {
      if (room && room.localParticipant.state === "connected") {
        room.localParticipant.tracks.forEach(
          (trackPublication) => void stopLocalTrack(trackPublication.track)
        );
        room.disconnect();
      }
    };
  }, [room]);

  const leaveSeat = useCallback(async () => {
    if (!user || !profile) return;
    const doc = `users/${user.uid}`;
    const existingData = profile.data;
    const update = {
      data: {
        ...existingData,
        [venueName]: {
          table: null,
          videoRoom: null,
        },
      },
    };
    const firestore = firebase.firestore();
    await firestore
      .doc(doc)
      .update(update)
      .catch(() => {
        firestore.doc(doc).set(update);
      });
    setSeatedAtTable && setSeatedAtTable("");
  }, [firebase, profile, setSeatedAtTable, user, venueName]);

  const onParticipantConnected = useCallback(
    (participant: Video.Participant) => {
      setParticipants((prevParticipants) => [
        // Hopefully prevents duplicate users in the participant list
        ...prevParticipants.filter(
          ({ identity }) => identity !== participant.identity
        ),
        participant,
      ]);
    },
    []
  );

  const onParticipantDisconnected = useCallback(
    (participant: Video.Participant) => {
      setParticipants((prevParticipants) => {
        if (!prevParticipants.find((p) => p === participant)) {
          // @debt Remove when root issue found and fixed
          console.error(
            "Could not find disconnnected participant:",
            participant
          );

          Bugsnag.notify(
            new Error("Could not find disconnnected participant"),
            (event) => {
              const { identity, sid } = participant;
              event.addMetadata("Room::participantDisconnected", {
                identity,
                sid,
              });
            }
          );
        }
        return prevParticipants.filter((p) => p !== participant);
      });
    },
    []
  );

  const connectToRoom = useCallback(() => {
    if (!token) return;

    return Video.connect(token, {
      name: roomName,
    })
      .then((room) => {
        setRoom(room);
        room.on("participantConnected", onParticipantConnected);
        room.on("participantDisconnected", onParticipantDisconnected);
        room.participants.forEach(onParticipantConnected);

        return room;
      })
      .catch((error) => setVideoError(error.message));
  }, [roomName, token, onParticipantConnected, onParticipantDisconnected]);

  const reconnectToVideoRoom = useCallback(() => {
    if (!token) return;

    setVideoError("");

    connectToRoom();
  }, [connectToRoom, token]);

  useEffect(() => {
    const roomConnection = connectToRoom();

    if (!roomConnection) return;

    roomConnection.then((room) => () => {
      if (room && room.localParticipant.state === "connected") {
        room.localParticipant.tracks.forEach(
          (trackPublication) => void stopLocalTrack(trackPublication.track)
        );
        room.disconnect();
      }
    });
  }, [connectToRoom]);

  useEffect(() => {
    if (!room) return;

    setUserList([
      ...participants.map((p) => worldUsersById[p.identity]),
      worldUsersById[room.localParticipant.identity],
    ]);
  }, [participants, setUserList, worldUsersById, room]);

  const getIsUserBartender = (userIdentity?: string) => {
    if (!userIdentity) return;

    return worldUsersById?.[userIdentity]?.data?.[roomName]?.bartender;
  };

  // Ordering of participants:
  // 1. Me
  // 2. Bartender, if found (only one allowed)
  // 3. Rest of the participants, in order

  // Only allow the first bartender to appear as bartender
  const userIdentity = room?.localParticipant?.identity;

  const meIsBartender = getIsUserBartender(userIdentity);

  // Video stream and local participant take up 2 slots
  // Ensure capacity is always even, so the grid works

  const profileData = room
    ? worldUsersById[room.localParticipant.identity]
    : undefined;

  const [sidedVideoParticipants, otherVideoParticipants] = useMemo(() => {
    const sidedVideoParticipants = participants.slice(
      0,
      NUM_OF_SIDED_USERS_MINUS_ONE
    );

    const otherVideoParticipants = participants.slice(
      NUM_OF_SIDED_USERS_MINUS_ONE
    );

    return [sidedVideoParticipants, otherVideoParticipants];
  }, [participants]);

  const sidedVideos = useMemo(
    () =>
      sidedVideoParticipants.map((participant) => {
        if (!participant) {
          return null;
        }

        const bartender = meIsBartender
          ? worldUsersById[participant.identity]?.data?.[roomName]?.bartender
          : undefined;

        return (
          <div key={participant.identity} className="jazzbar-room__participant">
            <Participant
              participant={participant}
              profileData={worldUsersById[participant.identity]}
              profileDataId={participant.identity}
              bartender={bartender}
            />
          </div>
        );
      }),
    [sidedVideoParticipants, meIsBartender, worldUsersById, roomName]
  );

  const otherVideos = useMemo(
    () =>
      otherVideoParticipants.map((participant) => {
        if (!participant) {
          return null;
        }

        const bartender = meIsBartender
          ? worldUsersById[participant.identity]?.data?.[roomName]?.bartender
          : undefined;

        return (
          <div key={participant.identity} className="jazzbar-room__participant">
            <Participant
              participant={participant}
              profileData={worldUsersById[participant.identity]}
              profileDataId={participant.identity}
              bartender={bartender}
            />
          </div>
        );
      }),
    [otherVideoParticipants, meIsBartender, worldUsersById, roomName]
  );

  const myVideo = useMemo(() => {
    return room && profileData ? (
      <div className="jazzbar-room__participant">
        <LocalParticipant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          profileData={profileData}
          profileDataId={room.localParticipant.identity}
          bartender={meIsBartender}
          defaultMute={defaultMute}
          isAudioEffectDisabled={isAudioEffectDisabled}
        />
      </div>
    ) : null;
  }, [meIsBartender, room, profileData, defaultMute, isAudioEffectDisabled]);

  if (!token) return null;

  return (
    <>
      {myVideo}
      {sidedVideos}
      <div className="jazzbar-room__participants">{otherVideos}</div>

      <VideoErrorModal
        show={!!videoError}
        onHide={() => setVideoError("")}
        errorMessage={videoError}
        onRetry={reconnectToVideoRoom}
        onBack={() => (setSeatedAtTable ? leaveSeat() : setVideoError(""))}
      />
    </>
  );
};

export default Room;