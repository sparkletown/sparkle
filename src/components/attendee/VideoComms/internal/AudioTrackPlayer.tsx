import React, { useEffect, useRef } from "react";

import { AudioTrack } from "../types";

interface AudioTrackPlayerProps {
  track: AudioTrack;
}

/**
 * This low level component exists to play an audio track from Twilio.
 * This component should not be used directly and only be components within
 * the VideoComms folder.
 */
export const AudioTrackPlayer: React.FC<AudioTrackPlayerProps> = ({
  track,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (track?.twilioTrack && audioRef.current) {
      track.twilioTrack.attach(audioRef.current);
      return () => {
        track.twilioTrack.detach();
      };
    }
  }, [track?.twilioTrack]);

  return <audio ref={audioRef} autoPlay />;
};
