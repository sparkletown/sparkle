import React, { useEffect, useRef } from "react";
import { AudioTrack } from "components/attendee/VideoComms/types";

interface AudioTrackPlayerProps {
  track: AudioTrack;
  isMuted?: boolean;
}

/**
 * This low level component exists to play an audio track from Twilio.
 * This component should not be used directly and only be components within
 * the VideoComms folder.
 */
export const AudioTrackPlayer: React.FC<AudioTrackPlayerProps> = ({
  track,
  isMuted = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (track?.twilioTrack && audioRef.current) {
      track.twilioTrack.attach(audioRef.current);
      return () => void track.twilioTrack.detach();
    }
  }, [track?.twilioTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return <audio ref={audioRef} autoPlay />;
};
