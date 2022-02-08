import React, { useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { VideoTrack } from "../VideoComms/types";
import { ButtonConfig, useVideoHuddle } from "../VideoHuddle/useVideoHuddle";

interface VideoTrackDisplayProps {
  track: VideoTrack;
}

interface ExtraButtonProps {
  buttonConfig: ButtonConfig;
  track: VideoTrack;
}

const ExtraButton: React.FC<ExtraButtonProps> = ({ buttonConfig, track }) => {
  const clickHandler = useCallback(() => {
    buttonConfig.callback({ track });
  }, [buttonConfig, track]);
  return <FontAwesomeIcon icon={buttonConfig.icon} onClick={clickHandler} />;
};

export const VideoTrackDisplay: React.FC<VideoTrackDisplayProps> = ({
  track,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { extraButtons } = useVideoHuddle();

  // @debt we should make tracks immutable or something so that this actually
  // triggers the useEffect to be recalculated
  const enabled = track.enabled;

  useEffect(() => {
    if (videoRef.current && enabled) {
      console.log("attaching");
      track.attach(videoRef.current);
      return () => {
        console.log("detaching");
        track.detach();
      };
    }
  }, [track, enabled]);

  return (
    <>
      {track.enabled ? (
        <>
          <video ref={videoRef} autoPlay={true} />
          {extraButtons.map((buttonConfig, idx) => (
            <ExtraButton key={idx} buttonConfig={buttonConfig} track={track} />
          ))}
        </>
      ) : (
        <span>Video disabled</span>
      )}
    </>
  );
};
