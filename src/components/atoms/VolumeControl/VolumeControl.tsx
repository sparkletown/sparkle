import React, { useCallback } from "react";
import classNames from "classnames";

import { MAX_AUDIO_VOLUME, MIN_AUDIO_VOLUME } from "settings";

import "./VolumeControl.scss";

export interface VolumeControlProps {
  className?: string;
  label?: string;
  name: string;
  setVolume: Function;
  volume: number;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  className = "",
  label,
  name,
  setVolume,
  volume,
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
      <input
        className="VolumeControl__input"
        type="range"
        id={name}
        name={name}
        min={MIN_AUDIO_VOLUME}
        max={MAX_AUDIO_VOLUME}
        onChange={onChange}
        value={volume}
      />
    </div>
  );
};
