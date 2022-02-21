import {
  faBan,
  faVideo,
  faVideoSlash,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { VideoSource } from "../types";

interface VideoCommsControlsProps {
  startAudio?: () => void;
  stopAudio?: () => void;
  startVideo?: () => void;
  stopVideo?: () => void;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  sourceType: VideoSource;
}

export const VideoCommsControls: React.FC<VideoCommsControlsProps> = ({
  startAudio,
  stopAudio,
  startVideo,
  stopVideo,
  audioEnabled,
  videoEnabled,
  sourceType,
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
      {stopVideo && videoEnabled && (
        <span onClick={stopVideo}>
          <FontAwesomeIcon
            icon={sourceType === VideoSource.Webcam ? faVideo : faBan}
          />
        </span>
      )}
      {startVideo && !videoEnabled && (
        <span onClick={startVideo}>
          <FontAwesomeIcon icon={faVideoSlash} />
        </span>
      )}
    </>
  );
};
