import React, { useState, useEffect } from "react";
import Participant, { ParticipantProps } from "./Participant";

type LocalParticipantProps = ParticipantProps & {
  leave: () => void;
};

const LocalParticipant: React.FC<LocalParticipantProps> = ({
  participant,
  user,
  setSelectedUserProfile,
  leave,
}) => {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);

  useEffect(() => {
    if (mic) {
      participant.audioTracks.forEach((audioTrack) => {
        audioTrack.track &&
          "enable" in audioTrack.track &&
          audioTrack.track.enable();
      });
    } else {
      participant.audioTracks.forEach((audioTrack) => {
        audioTrack.track &&
          "disable" in audioTrack.track &&
          audioTrack.track.disable();
      });
    }
  }, [participant, mic]);

  useEffect(() => {
    if (camera) {
      participant.videoTracks.forEach((videoTrack) => {
        videoTrack.track &&
          "enable" in videoTrack.track &&
          videoTrack.track.enable();
      });
    } else {
      participant.videoTracks.forEach((videoTrack) => {
        videoTrack.track &&
          "disable" in videoTrack.track &&
          videoTrack.track.disable();
      });
    }
  });

  return (
    <Participant
      participant={participant}
      user={user}
      setSelectedUserProfile={setSelectedUserProfile}
    >
      <div className="leave" onClick={() => leave()}>
        <div className="btn" />
      </div>
      <div className="av-controls">
        <div className="mic" onClick={() => setMic(!mic)}>
          <div className={`btn ${mic ? "on" : "off"}`} />
        </div>
        <div className="camera" onClick={() => setCamera(!camera)}>
          <div className={`btn ${camera ? "on" : "off"}`} />
        </div>
      </div>
    </Participant>
  );
};

export default LocalParticipant;
