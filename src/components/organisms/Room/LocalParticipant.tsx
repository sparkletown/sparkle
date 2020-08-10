import React, { useState, useEffect } from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Video from "twilio-video";
import { User } from "types/User";
import Participant from "./Participant";
import { WithId } from "utils/id";

interface LocalParticipantProps {
  participant: Video.Participant;
  profileData: WithId<User>;
  bartender?: User;
}

const LocalParticipant: React.FC<LocalParticipantProps> = ({
  participant,
  profileData,
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
