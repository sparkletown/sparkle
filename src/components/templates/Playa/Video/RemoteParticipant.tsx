import React, { useState, useEffect } from "react";
import Participant, { ParticipantProps } from "./Participant";

type RemoteParticipantProps = ParticipantProps & {
  host: boolean;
  remove: () => void;
};

const RemoteParticipant: React.FunctionComponent<RemoteParticipantProps> = ({
  participant,
  user,
  setSelectedUserProfile,
  host,
  remove,
}) => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  useEffect(() => {
    if (audio) {
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
  }, [participant, audio]);

  useEffect(() => {
    if (video) {
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
  }, [participant, video]);

  return (
    <Participant
      participant={participant}
      user={user}
      setSelectedUserProfile={setSelectedUserProfile}
    >
      {host && (
        <div className="remove" onClick={() => remove()}>
          Remove
        </div>
      )}
      <div className="av-controls">
        <div
          className={`audio ${audio ? "on" : "off"}`}
          onClick={() => setAudio(!audio)}
        />
        <div
          className={`video ${video ? "on" : "ooff"}`}
          onClick={() => setVideo(!video)}
        />
      </div>
    </Participant>
  );
};

export default RemoteParticipant;
