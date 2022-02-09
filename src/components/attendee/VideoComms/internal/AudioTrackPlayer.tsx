import React, { useEffect, useRef } from "react";

import { AudioTrack } from "../types";

interface AudioTrackPlayerProps {
  track: AudioTrack;
}

/**
 * This low level component exists to play an audio track from Twilio.
 * This component should not be used directly and only be components within
 * the VideoComms folder.
 *
 * @returns
 */
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
