import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";
import LocalParticipant from "./LocalParticipant";
import Participant from "./Participant";

import { EXPERIENCE_NAME } from "config";

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
      if (!user) return;

      // @ts-ignore
      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: user.uid,
        room: roomName,
      });
      setToken(response.data.token);
    })();
  }, [user, firebase, roomName]);

  useEffect(() => {
    if (!token) return;

    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [
        // Hopefully prevents duplicate users in the participant list
        ...prevParticipants.filter((p) => p.identity === participant.identity),
        participant,
      ]);
    };

    const participantDisconnected = (participant) => {
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
  }, [roomName, token]);

  useEffect(() => {
    if (!room) return;

    setUserList([
      ...participants.map((p) => users[p.identity]),
      users[room.localParticipant.identity],
    ]);
  }, [participants, setUserList, users, room]);

  if (!token) {
    return <></>;
  }

  // Ordering of participants:
  // 1. Me
  // 2. Bartender, if found (only one allowed)
  // 3. Rest of the participants, in order

  // Only allow the first bartender to appear as bartender
  let hasBartender = false;
  const meIsBartender =
    users[room?.localParticipant?.identity]?.data?.[EXPERIENCE_NAME]?.bartender;

  const meComponent = room ? (
    <LocalParticipant
      key={room.localParticipant.sid}
      participant={{
        participant: room.localParticipant,
        profileData: users[room.localParticipant.identity],
        bartender: meIsBartender,
      }}
    />
  ) : null;

  if (meIsBartender) {
    hasBartender = true;
  }

  const othersComponents = participants.map((participant, index) => {
    if (!participant) {
      return null;
    }

    const bartender =
      !hasBartender &&
      users[participant.identity]?.data?.[EXPERIENCE_NAME]?.bartender;
    if (bartender) {
      hasBartender = true;
    }

    return (
      <Participant
        key={`${participant.sid}-${index}`}
        participant={{
          participant,
          profileData: users[participant.identity],
          bartender,
        }}
      />
    );
  });

  return <>{[meComponent, ...othersComponents]}</>;
};

export default Room;
