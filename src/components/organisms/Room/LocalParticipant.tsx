import React, { useState, useEffect } from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Participant, { ParticipantProps } from "./Participant";

const LocalParticipant: React.FC<ParticipantProps> = ({
  participant,
  profileData,
  profileDataId,
  bartender,
}) => {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (muted) {
      participant.audioTracks.forEach(function (audioTrack) {
        audioTrack.track &&
          "disable" in audioTrack.track &&
          audioTrack.track.disable();
      });
    } else {
      participant.audioTracks.forEach(function (audioTrack) {
        audioTrack.track &&
          "enable" in audioTrack.track &&
          audioTrack.track.enable();
      });
    }
  }, [participant, muted]);

  return (
    <Participant
      participant={participant}
      profileData={profileData}
      profileDataId={profileDataId}
      bartender={bartender}
    >
      <div className="mute-container">
        <div onClick={() => setMuted(!muted)} id="mute-person">
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
