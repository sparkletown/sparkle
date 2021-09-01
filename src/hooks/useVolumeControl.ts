import { useCallback, useState } from "react";

import { DEFAULT_NOTIFICATIONS_VOLUME } from "settings";

export const useVolumeControl = (
  defaultVolume: number = DEFAULT_NOTIFICATIONS_VOLUME
) => {
  const [volume, setVolume] = useState<number>(defaultVolume);

  const volumeCallback = useCallback(
    (value: number) => {
      setVolume(value);
    },
    [setVolume]
  );

  return {
    volume,
    volumeCallback,
  };
};
