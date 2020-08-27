import React, { useState, useEffect, useMemo } from "react";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";
import LocalParticipant from "./LocalParticipant";
import RemoteParticipant from "./RemoteParticipant";
import "./Room.scss";
import { useUser } from "hooks/useUser";
import { useSelector, useKeyedSelector } from "hooks/useSelector";
import { WithId } from "utils/id";
import { User } from "types/User";

interface RoomProps {
  roomName: string;
  setSelectedUserProfile: (user: WithId<User>) => void;
}

const Room: React.FC<RoomProps> = ({ roomName, setSelectedUserProfile }) => {
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

  if (!user) return <></>;

  const me = useMemo(() => {
    return room ? (
      <div className="participant-container">
        <LocalParticipant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          user={users[user.uid]}
          setSelectedUserProfile={setSelectedUserProfile}
          leave={() => alert("leave clicked")}
        />
      </div>
    ) : null;
  }, [room]);

  const meIsHost = false; // REVISIT

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
              host={meIsHost}
              remove={() => alert("remove clicked")}
            />
          </div>
        );
      }),
    [participants, roomName, users]
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
