import { useEffect, useRef } from "react";
import Twilio from "twilio-video";

import styles from "./scss/TwilioTrackDisplay.module.scss";

interface TwilioTrackDisplayProps {
  track: Twilio.VideoTrack;
  isMirrored: boolean;
}

/**
 * This low level component exists to do the display of a track from Twilio.
 * This component should not be used directly and only be components within
 * the VideoComms folder.
 *
 * @returns
 */
export const TwilioTrackDisplay: React.FC<TwilioTrackDisplayProps> = ({
  track,
  isMirrored,
}) => {
  const classNames = isMirrored ? styles.mirrored : "";

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      track.attach(videoRef.current);
      return () => {
        track.detach();
      };
    }
  }, [track]);
  return <video className={classNames} ref={videoRef} autoPlay={true} />;
};
