import React, { useCallback } from "react";

import { MAX_VOLUME, MIN_VOLUME } from "settings";

export interface VolumeControlProps {
  setVolume: Function;
  volume: number;
  name: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  setVolume,
  volume,
  name,
}) => {
  const handleVolumeChange = useCallback(
    (ev) => setVolume(Number(ev.target.value)),
    [setVolume]
  );
  return (
    <input
      type="range"
      id={name}
      name={name}
      min={MIN_VOLUME}
      max={MAX_VOLUME}
      onChange={handleVolumeChange}
      value={volume}
    />
  );
};
