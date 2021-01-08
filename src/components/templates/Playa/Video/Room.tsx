import React, { useState, useEffect, useMemo } from "react";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";
import LocalParticipant from "./LocalParticipant";
import RemoteParticipant from "./RemoteParticipant";
import { useUser } from "hooks/useUser";
import { useUsersById } from "hooks/users";
import { User } from "types/User";
import { WithId } from "utils/id";

interface RoomProps {
  roomName: string;
  hostUid: string;
  setSelectedUserProfile: (user: WithId<User>) => void;
  leave: () => void;
  removeParticipant: (uid: string) => void;
}

const Room: React.FC<RoomProps> = ({
  roomName,
  hostUid,
  setSelectedUserProfile,
  leave,
  removeParticipant,
}) => {
  const [room, setRoom] = useState<Video.Room>();
  const [participants, setParticipants] = useState<Array<Video.Participant>>(
    []
  );

  const { user } = useUser();
  const usersById = useUsersById();
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      if (!user) return;

      // @ts-ignore
      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: user.uid,
        room: roomName,
      });
      setToken(response.data.token);
    })();
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
        user={usersById[user.uid] && { ...usersById[user.uid], id: user.uid }}
        setSelectedUserProfile={setSelectedUserProfile}
        isHost={hostUid === user.uid}
        leave={leave}
      />
    ) : null;
  }, [room, user, usersById, setSelectedUserProfile, hostUid, leave]);

  const others = useMemo(
    () =>
      user
        ? participants
            .filter((p) => !!p)
            .map((participant, index) => (
              <RemoteParticipant
                participant={participant}
                user={
                  usersById[participant.identity] && {
                    ...usersById[participant.identity],
                    id: participant.identity,
                  }
                }
                setSelectedUserProfile={setSelectedUserProfile}
                isHost={hostUid === participant.identity}
                showHostControls={hostUid === user.uid}
                remove={() => removeParticipant(participant.identity)}
                key={index}
              />
            ))
        : null,
    [
      participants,
      user,
      usersById,
      hostUid,
      setSelectedUserProfile,
      removeParticipant,
    ]
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
