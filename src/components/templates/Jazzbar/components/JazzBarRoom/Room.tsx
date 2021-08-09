import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useFirebase } from "react-redux-firebase";
import Bugsnag from "@bugsnag/js";
import Video from "twilio-video";

import { User } from "types/User";

import { getTwilioVideoToken } from "api/video";

import LocalParticipant from "components/organisms/Room/LocalParticipant";
import Participant from "components/organisms/Room/Participant";
import VideoErrorModal from "components/organisms/Room/VideoErrorModal";

import { useUser } from "hooks/useUser";
import { useWorldUsersById } from "hooks/users";

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

  const userFriendlyVideoError = (originalMessage: string) => {
    if (originalMessage.toLowerCase().includes("unknown")) {
      return `${originalMessage}; common remedies include closing any other programs using your camera, and giving your browser permission to access the camera.`;
    }
    return originalMessage;
  };

  // @debt refactor this to use useAsync or similar?
  useEffect(() => {
    if (!user) return;

    getTwilioVideoToken({
      userId: user.uid,
      roomName,
    }).then(setToken);
  }, [firebase, roomName, user]);

  const connectToVideoRoom = () => {
    if (!token) return;
    setVideoError("");

    Video.connect(token, {
      name: roomName,
    })
      .then((room) => {
        setRoom(room);
      })
      .catch((error) => setVideoError(userFriendlyVideoError(error.message)));
  };

  useEffect(() => {
    return () => {
      if (room && room.localParticipant.state === "connected") {
        room.localParticipant.tracks.forEach((trackPublication) => {
          //@ts-ignored
          trackPublication.track.stop(); //@debt typing does this work?
        });
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

  useEffect(() => {
    if (!token) return;

    let localRoom: Video.Room;

    const participantConnected = (participant: Video.Participant) => {
      setParticipants((prevParticipants) => [
        // Hopefully prevents duplicate users in the participant list
        ...prevParticipants.filter((p) => p.identity !== participant.identity),
        participant,
      ]);
    };

    const participantDisconnected = (participant: Video.Participant) => {
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
    };

    Video.connect(token, {
      name: roomName,
    })
      .then((room) => {
        setRoom(room);
        localRoom = room;
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      })
      .catch((error) => setVideoError(error.message));

    return () => {
      if (localRoom && localRoom.localParticipant.state === "connected") {
        localRoom.localParticipant.tracks.forEach((trackPublication) => {
          //@ts-ignored
          trackPublication.track.stop(); //@debt typing does this work?
        });
        localRoom.disconnect();
      }
    };
  }, [roomName, token, setParticipantCount]);

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
        onRetry={connectToVideoRoom}
        onBack={() => (setSeatedAtTable ? leaveSeat() : setVideoError(""))}
      />
    </>
  );
};

export default Room;
