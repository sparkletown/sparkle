import React, { useEffect, useRef } from "react";

import { AudioTrack } from "./types";

interface AudioTrackPlayerProps {
  track: AudioTrack;
}

export const AudioTrackPlayer: React.FC<AudioTrackPlayerProps> = ({
  track,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (track && audioRef.current) {
      track.attach(audioRef.current);
      return () => {
        track.detach();
      };
    }
  }, [track]);

  return <audio ref={audioRef} autoPlay={true} />;
};
