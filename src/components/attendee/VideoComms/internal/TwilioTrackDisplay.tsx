import { useEffect, useRef } from "react";
import classnames from "classnames";
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
 */
export const TwilioTrackDisplay: React.FC<TwilioTrackDisplayProps> = ({
  track,
  isMirrored,
}) => {
  const classes = classnames({
    [styles.mirrored]: isMirrored,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      const elForCleanup = videoRef.current;
      track.attach(videoRef.current);
      // The call to detach without any arguments will detach the Twilio video
      // stream from all video elements. That's not what we want at all. The
      // version with a single argument will detach just from the target
      // element
      return () => void track.detach(elForCleanup);
    }
  }, [track]);
  return <video className={classes} ref={videoRef} autoPlay />;
};
