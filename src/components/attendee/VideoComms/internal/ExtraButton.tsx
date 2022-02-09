import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonConfig } from "components/attendee/VideoHuddle/useVideoHuddle";

import { VideoTrack } from "../types";

interface ExtraButtonProps {
  buttonConfig: ButtonConfig;
  track: VideoTrack;
}

export const ExtraButton: React.FC<ExtraButtonProps> = ({
  buttonConfig,
  track,
}) => {
  const clickHandler = useCallback(() => {
    buttonConfig.callback({ track });
  }, [buttonConfig, track]);
  return <FontAwesomeIcon icon={buttonConfig.icon} onClick={clickHandler} />;
};
