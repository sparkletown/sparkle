import React, { useState, useEffect } from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Participant from "./Participant";

const LocalParticipant = ({ participant }) => {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (muted) {
      participant.participant.audioTracks.forEach(function (audioTrack) {
        audioTrack.track.disable();
      });
    } else {
      participant.participant.audioTracks.forEach(function (audioTrack) {
        audioTrack.track.enable();
      });
    }
  }, [participant, muted]);

  return (
    <Participant participant={participant}>
      <div className="mute-container">
        <div onClick={() => setMuted(!muted)}>
          <FontAwesomeIcon
            size="lg"
            icon={muted ? faMicrophoneSlash : faMicrophone}
            color={muted ? "red" : undefined}
          />
        </div>
      </div>
    </Participant>
  );
};

export default LocalParticipant;
