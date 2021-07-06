import { useEffect } from "react";

import { ReactHook } from "types/utility";

interface UseAudioProps {
  audioPath: string;
  isMuted: boolean;
}

export const useAudio: ReactHook<UseAudioProps, void> = ({
  audioPath,
  isMuted,
}) => {
  useEffect(() => {
    if (isMuted) return;

    const audio = new Audio(audioPath);

    audio.play();

    return () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio#memory_usage_and_management
      //   the audio will keep playing and the object will remain in memory until playback ends or is paused (such as by calling pause()).
      //   At that time, the object becomes subject to garbage collection.
      audio.pause();
    };
  }, [audioPath, isMuted]);
};
