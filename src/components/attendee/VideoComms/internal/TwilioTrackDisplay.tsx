import { useEffect, useRef } from "react";
import Twilio from "twilio-video";

interface _TwilioTrackDisplayProps {
  track: Twilio.VideoTrack;
}

/**
 * This low level component exists to do the display of a track from Twilio.
 * This component should not be used directly and only be components within
 * the VideoComms folder.
 *
 * @returns
 */
export const TwilioTrackDisplay: React.FC<_TwilioTrackDisplayProps> = ({
  track,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      track.attach(videoRef.current);
      return () => {
        track.detach();
      };
    }
  }, [track]);
  return <video ref={videoRef} autoPlay={true} />;
};
