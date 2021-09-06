import React, { useEffect } from "react";
import { useToggle } from "react-use";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faVolumeMute,
  faVolumeUp,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { assertUnreachable } from "utils/error";

import "./VideoOverlayButton.scss";

export type VideoOverlayButtonVariant = "microphone" | "camera" | "audio";

export interface VideoOverlayButtonProps extends ContainerClassName {
  variant: VideoOverlayButtonVariant;
  defaultValue: boolean;
  onEnabledChanged: (enabled: boolean) => void;
}

export const VideoOverlayButton: React.FC<VideoOverlayButtonProps> = ({
  variant,
  defaultValue,
  onEnabledChanged,
  containerClassName,
}) => {
  const [enabled, toggle] = useToggle(defaultValue);

  useEffect(() => onEnabledChanged(enabled), [enabled, onEnabledChanged]);

  let iconEnabled: IconDefinition = faMicrophone;
  let iconDisabled: IconDefinition = faMicrophoneSlash;
  switch (variant) {
    case "microphone":
      iconEnabled = faMicrophone;
      iconDisabled = faMicrophoneSlash;
      break;
    case "camera":
      iconEnabled = faVideo;
      iconDisabled = faVideoSlash;
      break;
    case "audio":
      iconEnabled = faVolumeUp;
      iconDisabled = faVolumeMute;
      break;
    default:
      assertUnreachable(variant);
  }

  return (
    <div
      className={classNames("VideoOverlayButton", containerClassName)}
      onClick={toggle}
    >
      <FontAwesomeIcon
        size="lg"
        icon={enabled ? iconEnabled : iconDisabled}
        color={enabled ? undefined : "red"}
      />
    </div>
  );
};
