import {
  faVideo,
  faVideoSlash,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useVideoComms } from "../hooks";

interface VideoCommsControlsProps {}

export const VideoCommsControls: React.FC<VideoCommsControlsProps> = () => {
  const {
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    isTransmittingAudio,
    isTransmittingVideo,
  } = useVideoComms();

  return (
    <>
      {isTransmittingAudio ? (
        <span onClick={stopAudio}>
          <FontAwesomeIcon icon={faVolumeUp} />
        </span>
      ) : (
        <span onClick={startAudio}>
          <FontAwesomeIcon icon={faVolumeMute} />
        </span>
      )}
      {isTransmittingVideo ? (
        <span onClick={stopVideo}>
          <FontAwesomeIcon icon={faVideo} />
        </span>
      ) : (
        <span onClick={startVideo}>
          <FontAwesomeIcon icon={faVideoSlash} />
        </span>
      )}
    </>
  );
};
