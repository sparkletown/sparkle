import {
  faVideo,
  faVideoSlash,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface VideoCommsControlsProps {
  startAudio?: () => void;
  stopAudio?: () => void;
  startVideo?: () => void;
  stopVideo?: () => void;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

export const VideoCommsControls: React.FC<VideoCommsControlsProps> = ({
  startAudio,
  stopAudio,
  startVideo,
  stopVideo,
  audioEnabled,
  videoEnabled,
}) => {
  return (
    <>
      {startAudio &&
        (audioEnabled ? (
          <span onClick={stopAudio}>
            <FontAwesomeIcon icon={faVolumeUp} />
          </span>
        ) : (
          <span onClick={startAudio}>
            <FontAwesomeIcon icon={faVolumeMute} />
          </span>
        ))}
      {startVideo &&
        (videoEnabled ? (
          <span onClick={stopVideo}>
            <FontAwesomeIcon icon={faVideo} />
          </span>
        ) : (
          <span onClick={startVideo}>
            <FontAwesomeIcon icon={faVideoSlash} />
          </span>
        ))}
    </>
  );
};
