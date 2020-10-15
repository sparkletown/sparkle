import { useEffect, useRef, useState } from "react";

export const useRadio = (audio?: HTMLAudioElement) => {
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
    if (audio) {
      audio.volume = volume / 100;
      audio.play();
    }
  }, [volume, audio]);

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);

  return { volume, setVolume };
};
