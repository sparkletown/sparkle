import React, { useCallback } from "react";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import {
  DEFAULT_AUDIO_VOLUME,
  MAX_AUDIO_VOLUME,
  MIN_AUDIO_VOLUME,
} from "settings/index";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./VolumeControl.scss";

export interface VolumeControlProps {
  className?: string;
  label?: string;
  name: string;
  muted?: boolean;
  onMute?: () => void;
  onVolume?: (volume: number) => void;
  volume?: number;
  withMute?: boolean;
  withSlider?: boolean;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  className = "",
  label = "",
  name,
  muted,
  onMute,
  onVolume,
  volume = DEFAULT_AUDIO_VOLUME,
  withMute = false,
  withSlider = false,
}) => {
  const onSlider = useCallback(
    (event) => {
      const volume = Number(event.target.value);
      return onVolume?.(volume);
    },
    [onVolume]
  );

  const parentClasses = classNames({
    VolumeControl: true,
    "VolumeControl--with-label": label,
    "VolumeControl--with-mute": withMute,
    "VolumeControl--with-slider": withSlider,
    [className]: className,
  });

  return (
    <div className={parentClasses}>
      {label && <div className="VolumeControl__label">{label}</div>}

      {withMute && (
        <ButtonNG
          className="VolumeControl__mute"
          iconOnly
          iconName={volume && !muted ? faVolumeMute : faVolumeUp}
          onClick={onMute}
        />
      )}

      {withSlider && (
        <input
          className="VolumeControl__slide"
          type="range"
          id={name}
          name={name}
          min={MIN_AUDIO_VOLUME}
          max={MAX_AUDIO_VOLUME}
          value={volume}
          onChange={onSlider}
        />
      )}
    </div>
  );
};
