import React, { useState } from "react";
import Participant, { ParticipantProps } from "./Participant";

type RemoteParticipantProps = ParticipantProps & {
  remove: () => void;
  showHostControls: boolean;
};

const RemoteParticipant: React.FunctionComponent<RemoteParticipantProps> = ({
  participant,
  user,
  isHost,
  remove,
  showHostControls,
}) => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  return (
    <Participant
      participant={participant}
      user={user}
      isHost={isHost}
      audio={audio}
      video={video}
    >
      {showHostControls && (
        <div className="remove" onClick={() => remove()}>
          Remove
        </div>
      )}
      <div className="av-controls">
        <div className="audio" onClick={() => setAudio(!audio)}>
          <div className={`btn ${audio ? "on" : "off"}`} />
        </div>
        <div className="video" onClick={() => setVideo(!video)}>
          <div className={`btn ${video ? "on" : "off"}`} />
        </div>
      </div>
    </Participant>
  );
};

export default RemoteParticipant;
