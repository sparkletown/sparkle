import React, { useState, useEffect, useMemo } from "react";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";
import LocalParticipant from "./LocalParticipant";
import RemoteParticipant from "./RemoteParticipant";
import { useUser } from "hooks/useUser";
import { useKeyedSelector } from "hooks/useSelector";
import { WithId } from "utils/id";
import { User } from "types/User";

interface RoomProps {
  roomName: string;
  host: boolean;
  setSelectedUserProfile: (user: WithId<User>) => void;
  leave: () => void;
  removeParticipant: (uid: string) => void;
}

const Room: React.FC<RoomProps> = ({
  roomName,
  host,
  setSelectedUserProfile,
  leave,
  removeParticipant,
}) => {
  const [room, setRoom] = useState<Video.Room>();
  const [participants, setParticipants] = useState<Array<Video.Participant>>(
    []
  );

  const { user } = useUser();
  const { users } = useKeyedSelector(
    (state) => ({
      users: state.firestore.data.partygoers,
    }),
    ["users"]
  );
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
      <div className="participant-container">
        <LocalParticipant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          user={users[user.uid]}
          setSelectedUserProfile={setSelectedUserProfile}
          leave={leave}
        />
      </div>
    ) : null;
  }, [room, user, users, setSelectedUserProfile, leave]);

  const others = useMemo(
    () =>
      participants.map((participant, index) => {
        if (!participant) {
          return null;
        }

        return (
          <div key={participant.identity} className="participant-container">
            <RemoteParticipant
              key={index}
              participant={participant}
              user={users[participant.identity]}
              setSelectedUserProfile={setSelectedUserProfile}
              host={host}
              remove={() => removeParticipant(participant.identity)}
            />
          </div>
        );
      }),
    [participants, users, host, setSelectedUserProfile, removeParticipant]
  );

  if (!token) {
    return <></>;
  }

  return (
    <>
      {me}
      {others}
    </>
  );
};

export default Room;
