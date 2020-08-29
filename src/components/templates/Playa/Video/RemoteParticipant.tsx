import React, { useState } from "react";
import Participant, { ParticipantProps } from "./Participant";

type RemoteParticipantProps = ParticipantProps & {
  remove: () => void;
};

const RemoteParticipant: React.FunctionComponent<RemoteParticipantProps> = ({
  participant,
  user,
  setSelectedUserProfile,
  host,
  remove,
  style,
}) => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  return (
    <Participant
      participant={participant}
      user={user}
      setSelectedUserProfile={setSelectedUserProfile}
      style={style}
      audio={audio}
      video={video}
    >
      {host && (
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
