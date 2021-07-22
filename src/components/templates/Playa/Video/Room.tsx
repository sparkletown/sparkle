import React, { useState, useEffect, useMemo } from "react";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";

import { getTwilioVideoToken } from "api/video";

import { useUser } from "hooks/useUser";
import { useWorldUsersById } from "hooks/users";

import LocalParticipant from "./LocalParticipant";
import RemoteParticipant from "./RemoteParticipant";

interface RoomProps {
  roomName: string;
  hostUid: string;
  leave: () => void;
  removeParticipant: (uid: string) => void;
}

const Room: React.FC<RoomProps> = ({
  roomName,
  hostUid,
  leave,
  removeParticipant,
}) => {
  const [room, setRoom] = useState<Video.Room>();
  const [participants, setParticipants] = useState<Array<Video.Participant>>(
    []
  );

  const { user } = useUser();

  const { worldUsersById } = useWorldUsersById();
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  // @debt refactor this to use useAsync or similar?
  useEffect(() => {
    if (!user) return;

    getTwilioVideoToken({
      userId: user.uid,
      roomName,
    }).then(setToken);
  }, [firebase, roomName, user]);

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
          // Remove when root issue foudn and fixed
          console.error("Could not find disconnnected participant:");
          console.error(participant);
        }
        return prevParticipants.filter((p) => p !== participant);
      });
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      localRoom = room;
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      if (localRoom && localRoom.localParticipant.state === "connected") {
        localRoom.localParticipant.tracks.forEach(function (trackPublication) {
          //@ts-ignored
          trackPublication.track.stop(); //@debt typing does this work?
        });
        localRoom.disconnect();
      }
    };
  }, [roomName, token]);

  const me = useMemo(() => {
    return room && user ? (
      <LocalParticipant
        participant={room.localParticipant}
        user={
          worldUsersById[user.uid] && {
            ...worldUsersById[user.uid],
            id: user.uid,
          }
        }
        isHost={hostUid === user.uid}
        leave={leave}
      />
    ) : null;
  }, [room, user, worldUsersById, hostUid, leave]);

  const others = useMemo(
    () =>
      user
        ? participants
            .filter((p) => !!p)
            .map((participant, index) => (
              <RemoteParticipant
                participant={participant}
                user={
                  worldUsersById[participant.identity] && {
                    ...worldUsersById[participant.identity],
                    id: participant.identity,
                  }
                }
                isHost={hostUid === participant.identity}
                showHostControls={hostUid === user.uid}
                remove={() => removeParticipant(participant.identity)}
                key={index}
              />
            ))
        : null,
    [participants, user, worldUsersById, hostUid, removeParticipant]
  );

  if (!token) {
    return <></>;
  }

  return (
    <div className="room">
      {me}
      {others}
    </div>
  );
};

export default Room;
