import { useEffect, useRef, useState } from "react";
import Bugsnag from "@bugsnag/js";

import { MAX_AUDIO_VOLUME, MIN_AUDIO_VOLUME } from "settings";

export const useAudioVolume: (options: {
  audioElement?: HTMLAudioElement;
  initialVolume: number;
  isAudioPlaying: boolean;
  storageKey: string;
}) => {
  volume: number;
  setVolume: (volume: number) => void;
} = ({ audioElement, initialVolume, isAudioPlaying, storageKey }) => {
  const [volume, setVolume] = useState<number>(initialVolume);
  const isInitialStateLoadedRef = useRef(false);

  useEffect(() => {
    // @debt the entire localStorage access and error check/reporting should be extracted to its own separate utility
    localStorage.setItem(storageKey, JSON.stringify({ volume }));

    if (isInitialStateLoadedRef.current) {
      return;
    }

    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        setVolume(parsedState.volume);
        isInitialStateLoadedRef.current = true;
      }
    } catch (e) {
      console.error("useAudioVolume", "Problem loading initial volume", e);

      Bugsnag.notify(e, (event) => {
        event.addMetadata("context", {
          location: "hooks/useAudioVolume::useAudioVolume",
          storageKey: storageKey,
          isInitialStateLoaded: isInitialStateLoadedRef.current,
          volume,
        });
      });
    }
  }, [volume, storageKey]);

  useEffect(() => {
    const clampedVolume = Number.isFinite(volume)
      ? volume < MIN_AUDIO_VOLUME
        ? MIN_AUDIO_VOLUME
        : volume > MAX_AUDIO_VOLUME
        ? MAX_AUDIO_VOLUME
        : volume
      : initialVolume;

    if (audioElement && isAudioPlaying) {
      // division used because volume values go from 0 to 100 (as in %)
      audioElement.volume = clampedVolume / 100;
      // audioElement.loop = true;
      audioElement?.play();

      return () => {
        audioElement.volume = 0;
        // audioElement.pause();
        audioElement.remove();
      };
    }
  }, [volume, initialVolume, audioElement, isAudioPlaying]);

  return { volume, setVolume };
};
