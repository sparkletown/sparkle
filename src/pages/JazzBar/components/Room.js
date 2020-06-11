import React from "react";
import Participant from "./Participant";
import useTwilioRoom from "../components/useTwilioRoom";

const Room = ({ roomName }) => {
  const { participants } = useTwilioRoom(roomName);
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
