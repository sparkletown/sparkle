import { useEffect, useRef, useState } from "react";

export const useRadio = (playRadio: boolean, audio?: HTMLAudioElement) => {
  const [volume, setVolume] = useState<number>(10);

  const loadedInitialState = useRef(false);

  useEffect(() => {
    const storageKey = "Radio";
    if (!loadedInitialState.current) {
      try {
        const storedState = localStorage.getItem(storageKey);
        if (storedState) {
          const state = JSON.parse(storedState);
          setVolume(state.volume);
          loadedInitialState.current = true;
        }
      } catch {}
    }
    localStorage.setItem(storageKey, JSON.stringify({ volume }));
  }, [volume]);

  useEffect(() => {
    if (audio && playRadio) {
      audio.volume = volume / 100;
      audio?.play();

      return () => {
        audio.volume = 0;
        audio.remove();
      };
    }
  }, [volume, audio, playRadio]);

  return { volume, setVolume };
};
