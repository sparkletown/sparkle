import {
  faBan,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { VideoSource } from "../types";

import styles from "./scss/VideoCommsControls.module.scss";

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
            <FontAwesomeIcon icon={faMicrophone} />
          </span>
        ) : (
          <span onClick={startAudio} className="VideoCommsControls--disabled">
            <FontAwesomeIcon
              className={styles["VideoCommsControls--disabled"]}
              icon={faMicrophoneSlash}
            />
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
          <FontAwesomeIcon
            className={styles["VideoCommsControls--disabled"]}
            icon={faVideoSlash}
          />
        </span>
      )}
    </>
  );
};
