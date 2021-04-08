import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useCallback } from "react";
import Participant, { ParticipantProps } from "./Participant";

type LocalParticipantProps = ParticipantProps & {
  leave: () => void;
  showLeave?: boolean;
  useFontAwesome?: boolean;
  showName?: boolean;
};

const LocalParticipant: React.FC<LocalParticipantProps> = ({
  participant,
  user,
  isHost,
  showLeave = true,
  leave,
  useFontAwesome,
  showName,
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

  const onMicClick = useCallback(() => setMic(!mic), [mic]);

  const renderMicIcon = () => {
    if (useFontAwesome) {
      return (
        <FontAwesomeIcon
          onClick={onMicClick}
          size="lg"
          icon={!mic ? faMicrophoneSlash : faMicrophone}
          color={!mic ? "red" : undefined}
        />
      );
    }

    return (
      <div className="mic" onClick={onMicClick}>
        <div className={`btn ${mic ? "on" : "off"}`} />
      </div>
    );
  };

  const onCameraClick = useCallback(() => setCamera(!camera), [camera]);

  const renderCameraIcon = () => {
    if (useFontAwesome) {
      return (
        <FontAwesomeIcon
          onClick={onCameraClick}
          size="lg"
          icon={!camera ? faVideoSlash : faVideo}
          color={!camera ? "red" : undefined}
        />
      );
    }

    return (
      <div className="camera" onClick={onCameraClick}>
        <div className={`btn ${camera ? "on" : "off"}`} />
      </div>
    );
  };

  return (
    <Participant
      participant={participant}
      user={user}
      isHost={isHost}
      local
      showName={showName}
    >
      {showLeave && (
        <div className="leave" onClick={leave}>
          <div className="btn" />
        </div>
      )}
      <div className="av-controls">
        {renderMicIcon()}
        {renderCameraIcon()}
      </div>
    </Participant>
  );
};

export default LocalParticipant;
