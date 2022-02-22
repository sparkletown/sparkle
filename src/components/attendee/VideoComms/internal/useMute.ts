import { useCallback, useState } from "react";

export const useMute = () => {
  const [isMuted, setIsMuted] = useState(false);
  const mute = useCallback(() => {
    setIsMuted(true);
  }, []);
  const unmute = useCallback(() => {
    setIsMuted(false);
  }, []);
  return {
    isMuted,
    mute,
    unmute,
  };
};
