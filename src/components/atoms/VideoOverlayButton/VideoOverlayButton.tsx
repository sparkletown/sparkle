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

import "./VideoOverlayButton.scss";

export type VideoOverlayButtonVariant = "microphone" | "camera" | "audio";

export type VideoOverlayButtonIcons = {
  enabled: IconDefinition;
  disabled: IconDefinition;
};

const ICONS: Readonly<
  Record<VideoOverlayButtonVariant, VideoOverlayButtonIcons>
> = {
  microphone: {
    enabled: faMicrophone,
    disabled: faMicrophoneSlash,
  },
  camera: { enabled: faVideo, disabled: faVideoSlash },
  audio: { enabled: faVolumeUp, disabled: faVolumeMute },
};

export interface VideoOverlayButtonProps extends ContainerClassName {
  variant: VideoOverlayButtonVariant;
  defaultValue: boolean;
  onEnabledChanged: (enabled: boolean) => void;
}

export const VideoOverlayButton: React.FC<VideoOverlayButtonProps> = ({
  variant = "microphone",
  defaultValue,
  onEnabledChanged,
  containerClassName,
}) => {
  const [state, toggle] = useToggle(defaultValue);

  useEffect(() => {
    onEnabledChanged(state);
  }, [state, onEnabledChanged]);

  const { enabled, disabled } = ICONS[variant];

  return (
    <div
      className={classNames("VideoOverlayButton", containerClassName)}
      onClick={toggle}
    >
      <FontAwesomeIcon
        size="lg"
        icon={state ? enabled : disabled}
        color={state ? undefined : "red"}
      />
    </div>
  );
};
