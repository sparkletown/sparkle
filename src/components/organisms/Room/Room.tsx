import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Video from "twilio-video";

import { getUser } from "api/profile";
import { unsetTableSeat } from "api/venue";
import { useTwilioVideoToken } from "api/video";

import { ParticipantWithUser } from "types/rooms";

import { logIfCannotFindExistingParticipant } from "utils/room";
import { stopLocalTrack } from "utils/twilio";

import { useUser } from "hooks/useUser";

import { LocalParticipant } from "./LocalParticipant";
import { Participant } from "./Participant";
import VideoErrorModal from "./VideoErrorModal";

import "./Room.scss";

interface RoomProps {
  roomName: string;
  venueId: string;
  setParticipantCount?: (val: number) => void;
  setSeatedAtTable?: (val: string) => void;
  onBack?: () => void;
  hasChairs?: boolean;
  defaultMute?: boolean;
}

const Room: React.FC<RoomProps> = ({
  roomName,
  venueId,
  setParticipantCount,
  setSeatedAtTable,
  hasChairs = true,
  defaultMute,
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

  const participantContainerClassName = useMemo(() => {
    const attendeeCount = (participants.length ?? 0) + 1; // Include yourself
    if (attendeeCount <= 4) {
      return "two-across";
    }
    return "three-across";
  }, [participants.length]);

  const meComponent = useMemo(() => {
    return room && profile ? (
      <div className={`participant-container ${participantContainerClassName}`}>
        <LocalParticipant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          profileData={profile}
          profileDataId={room.localParticipant.identity}
          defaultMute={defaultMute}
        />
      </div>
    ) : null;
  }, [room, profile, defaultMute, participantContainerClassName]);

  const othersComponents = useMemo(
    () =>
      participants.map((participant) => {
        if (!participant) {
          return null;
        }

        return (
          <div
            key={participant.participant.identity}
            className={`participant-container ${participantContainerClassName}`}
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
    [participants, participantContainerClassName]
  );

  const emptyComponents = useMemo(
    () =>
      hasChairs
        ? Array(participants.length % 2).map((e, index) => (
            <div
              key={`empty-participant-${index}`}
              className={`participant-container ${participantContainerClassName}`}
            >
              <img
                className="empty-chair-image"
                src="/empty-chair.png"
                alt="empty chair"
              />
            </div>
          ))
        : [],
    [hasChairs, participants.length, participantContainerClassName]
  );

  if (!token) {
    return <></>;
  }

  return (
    <Fragment>
      {meComponent}
      {othersComponents}
      {emptyComponents}
      <VideoErrorModal
        show={!!videoError}
        onHide={() => setVideoError("")}
        errorMessage={videoError}
        onRetry={connectToVideoRoom}
        onBack={() => (setSeatedAtTable ? leaveSeat() : setVideoError(""))}
      />
    </Fragment>
  );
};

export default Room;
