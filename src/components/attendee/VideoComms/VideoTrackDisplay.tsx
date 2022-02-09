import React, { useEffect, useRef } from "react";
import Twilio from "twilio-video";

import { VideoTrack } from "../VideoComms/types";

interface VideoTrackDisplayProps {
  track: VideoTrack;
}

interface _TwilioTrackDisplayProps {
  track: Twilio.VideoTrack;
}

const TwilioTrackDisplay: React.FC<_TwilioTrackDisplayProps> = ({ track }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      console.log("attachgin");
      track.attach(videoRef.current);
      return () => {
        console.log("detachgin");
        track.detach();
      };
    }
  }, [track]);
  return <video ref={videoRef} autoPlay={true} />;
};

export const VideoTrackDisplay: React.FC<VideoTrackDisplayProps> = ({
  track,
}) => {
  // @debt we should make tracks immutable or something so that this actually
  // triggers the useEffect to be recalculated

  return (
    <>
      {track.enabled ? (
        <>
          <TwilioTrackDisplay track={track.twilioTrack} />
        </>
      ) : (
        <span>Video disabled</span>
      )}
    </>
  );
};
