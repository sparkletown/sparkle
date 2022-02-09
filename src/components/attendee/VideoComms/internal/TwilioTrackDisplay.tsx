import { useEffect, useRef } from "react";
import Twilio from "twilio-video";

interface _TwilioTrackDisplayProps {
  track: Twilio.VideoTrack;
}

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
