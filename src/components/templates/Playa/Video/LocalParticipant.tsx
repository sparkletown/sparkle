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
      <div className="actions">
        <div className="leave" onClick={() => leave()} />
        <div
          className={`mic ${mic ? "on" : "off"}`}
          onClick={() => setMic(!mic)}
        />
        <div
          className={`camera ${camera ? "on" : "ooff"}`}
          onClick={() => setCamera(!camera)}
        />
      </div>
    </Participant>
  );
};

export default LocalParticipant;
