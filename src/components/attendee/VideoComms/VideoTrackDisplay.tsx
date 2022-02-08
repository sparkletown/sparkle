import React, { useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { VideoTrack } from "../VideoComms/types";
import { ButtonConfig, useVideoHuddle } from "../VideoHuddle/useVideoHuddle";

import styles from "./VideoTrackDisplay.module.scss";

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

  const { augmentFunction: AugmentFunction, extraButtons } = useVideoHuddle();

  useEffect(() => {
    if (track && videoRef.current) {
      track.attach(videoRef.current);
      return () => {
        track.detach();
      };
    }
  }, [track]);

  const augment = AugmentFunction && <AugmentFunction track={track} />;

  return (
    <>
      {track && (
        <>
          <video ref={videoRef} autoPlay={true} />
          {augment}
          {extraButtons.map((buttonConfig, idx) => (
            <ExtraButton key={idx} buttonConfig={buttonConfig} track={track} />
          ))}
        </>
      )}
    </>
  );
};
