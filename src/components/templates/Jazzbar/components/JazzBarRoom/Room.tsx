import React, { useCallback, useEffect, useMemo, useState } from "react";
import Video from "twilio-video";

import { getUser } from "api/profile";
import { unsetTableSeat } from "api/venue";
import { useTwilioVideoToken } from "api/video";

import { ParticipantWithUser } from "types/rooms";

import { logIfCannotFindExistingParticipant } from "utils/room";
import { stopLocalTrack } from "utils/twilio";

import { useUser } from "hooks/useUser";

import { LocalParticipant } from "components/organisms/Room/LocalParticipant";
import { Participant } from "components/organisms/Room/Participant";
import VideoErrorModal from "components/organisms/Room/VideoErrorModal";

import "./Room.scss";

const NUM_OF_SIDED_USERS_MINUS_ONE = 3;

interface RoomProps {
  roomName: string;
  venueId: string;
  setParticipantCount?: (val: number) => void;
  setSeatedAtTable?: (val: string) => void;
  onBack?: () => void;
  defaultMute?: boolean;
  isAudioEffectDisabled: boolean;
}

// @debt THIS COMPONENT IS THE COPY OF components/molecules/Room
// The reason to copy it was the lack of time to refactor the whole thing, so the
// safest approch (not to break other Venues that rely on TableComponent) is to copy this component
// It needs to get deleted in the future
const Room: React.FC<RoomProps> = ({
  roomName,
  venueId,
  setParticipantCount,
  setSeatedAtTable,
  defaultMute,
  isAudioEffectDisabled,
}) => {
  const [room, setRoom] = useState<Video.Room>();
  const [videoError, setVideoError] = useState<string>("");
  const [participants, setParticipants] = useState<ParticipantWithUser[]>([]);

  const { userId, profile } = useUser();

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

  const { value: token } = useTwilioVideoToken({
    userId,
    roomName,
  });

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
          stopLocalTrack(trackPublication.track);
        });
        room.disconnect();
      }
    };
  }, [room]);

  const leaveSeat = useCallback(async () => {
    if (!userId || !venueId) return;

    await unsetTableSeat(userId, { venueId });

    setSeatedAtTable?.("");
  }, [setSeatedAtTable, userId, venueId]);

  useEffect(() => {
    if (!token) return;

    let localRoom: Video.Room;

    const participantConnected = async (participant: Video.Participant) => {
      const user = await getUser(participant.identity);
      setParticipants((prevParticipants) => [
        ...prevParticipants.filter(
          (p) => p.participant.identity !== participant.identity
        ),
        { participant, user },
      ]);
    };

    const participantDisconnected = (participant: Video.Participant) => {
      setParticipants((prevParticipants) => {
        logIfCannotFindExistingParticipant(prevParticipants, participant);
        return prevParticipants.filter(
          (p) => p.participant.identity !== participant.identity
        );
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
          stopLocalTrack(trackPublication.track);
        });
        localRoom.disconnect();
      }
    };
  }, [roomName, token, setParticipantCount]);

  // Video stream and local participant take up 2 slots
  // Ensure capacity is always even, so the grid works

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

        return (
          <div
            key={participant.participant.identity}
            className="jazzbar-room__participant"
          >
            <Participant
              participant={participant.participant}
              profileData={participant.user}
              profileDataId={participant.user.id}
              isShowSoundDisable
            />
          </div>
        );
      }),
    [sidedVideoParticipants]
  );

  const otherVideos = useMemo(
    () =>
      otherVideoParticipants.map((participant) => {
        if (!participant) {
          return null;
        }

        return (
          <div
            key={participant.participant.identity}
            className="jazzbar-room__participant"
          >
            <Participant
              participant={participant.participant}
              profileData={participant.user}
              profileDataId={participant.user.id}
              isShowSoundDisable
            />
          </div>
        );
      }),
    [otherVideoParticipants]
  );

  const myVideo = useMemo(() => {
    return room && profile ? (
      <div className="jazzbar-room__participant">
        <LocalParticipant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          profileData={profile}
          profileDataId={room.localParticipant.identity}
          defaultMute={defaultMute}
          isAudioEffectDisabled={isAudioEffectDisabled}
        />
      </div>
    ) : null;
  }, [room, profile, defaultMute, isAudioEffectDisabled]);

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
