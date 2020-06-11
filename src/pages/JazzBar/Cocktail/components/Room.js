import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "../../components/Participant";

const Room = ({ roomName, token }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
      [1, 2, 3, 4, 5, 6, 7].forEach(() =>
        participantConnected(room.localParticipant)
      );
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  return (
    <>
      {participants.length > 0 ? (
        participants.map((participant, index) => (
          <Participant
            key={`${participant.sid}-${index}`}
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
