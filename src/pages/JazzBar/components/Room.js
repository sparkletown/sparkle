import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";
import Participant from "./Participant";

const Room = ({ roomName, setUserList }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  const { user, users } = useSelector((state) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));
  const [token, setToken] = useState();
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      if (!user || !users) return;

      // @ts-ignore
      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: user.uid,
        room: roomName,
      });
      setToken(response.data.token);
    })();
  }, [firebase, user, users, roomName]);

  useEffect(() => {
    if (!token) return;

    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        { participant, profileData: users[participant.identity] },
      ]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.participant !== participant)
      );
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
      // [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16].forEach(() =>
      //   participantConnected(room.localParticipant)
      // );
    });

    return () => {
      if (room && room.localParticipant.state === "connected") {
        room.localParticipant.tracks.forEach(function (trackPublication) {
          trackPublication.track.stop();
        });
        room.disconnect();
        return null;
      } else {
        return room;
      }
    };
  }, [roomName, room, token, users]);

  useEffect(() => {
    if (!room) return;

    setUserList([
      ...participants.map((p) => p.profileData),
      users[room.localParticipant.identity],
    ]);
  }, [participants, setUserList, users, room]);

  if (!token) {
    return <></>;
  }

  return (
    <>
      {participants.length > 0 ? (
        participants.map((participant, index) => (
          <Participant
            key={`${participant.participant.sid}-${index}`}
            participant={participant}
            index={index}
          />
        ))
      ) : (
        <>No one in here yet.</>
      )}
    </>
  );
};

export default Room;
