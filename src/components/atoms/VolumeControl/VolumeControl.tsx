import React, { useCallback } from "react";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { MAX_AUDIO_VOLUME, MIN_AUDIO_VOLUME } from "settings";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./VolumeControl.scss";

export interface VolumeControlProps {
  className?: string;
  label?: string;
  name: string;
  setVolume: Function;
  volume: number;
  withMute?: boolean;
  withSlider?: boolean;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  className = "",
  label,
  name,
  setVolume,
  volume,
  withMute = false,
  withSlider = false,
}) => {
  const onChange = useCallback(
    (ev) => {
      const volume = Number(ev.target.value);
      return setVolume(volume);
    },
    [setVolume]
  );

  const parentClasses = classNames({
    VolumeControl: true,
    VolumeControl__container: true,
    [className]: className,
  });

  return (
    <div className={parentClasses}>
      <div className="VolumeControl__label">{label}</div>
      {withMute && (
        <ButtonNG
          className="VolumeControl__mute"
          iconOnly
          iconName={volume ? faVolumeUp : faVolumeMute}
          iconSize="1x"
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
          onChange={onChange}
          value={volume}
        />
      )}
    </div>
  );
};
