import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { VideoTrack } from "../../VideoComms/types";
import { ButtonConfig } from "../HuddleProvider";

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
  return (
    <span>
      <FontAwesomeIcon icon={buttonConfig.icon} onClick={clickHandler} />
    </span>
  );
};
