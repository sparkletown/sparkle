import React, { useCallback, useEffect, useRef, useState } from "react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./DeviceVideo.scss";

export interface DeviceVideoProps {
  facingMode?: "user" | "environment";
  onPlay?: () => void;
  onError?: (e: Error) => void;
}

export const DeviceVideo: React.FC<DeviceVideoProps> = ({
  facingMode = "user",
  onPlay,
  onError,
}) => {
  const [error, setError] = useState();
  const [playing, setPlaying] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = useCallback(
    () =>
      videoRef.current
        ?.play()
        .then(() => {
          setPlaying(true);
          onPlay?.();
        })
        .catch((e) => {
          console.error(DeviceVideo.name, e);
          setError(e);
          onError?.(e);
        }),
    [onPlay, onError]
  );

  useEffect(() => {
    if (mediaStream) {
      return () => {
        // NOTE: might be edge case after component destruction that could raise invalid invocation error
        for (const track of mediaStream.getTracks()) {
          try {
            track?.stop?.();
          } catch (e) {
            console.warn(DeviceVideo.name, e);
          }
        }
      };
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { facingMode },
      })
      .then(setMediaStream)
      .catch((e) => {
        console.error(DeviceVideo.name, e);
        setError(e);
        onError?.(e);
      });
  }, [mediaStream, facingMode, onError]);

  if (videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  if (!mediaStream) {
    return (
      <div className="DeviceVideo DeviceVideo--no-stream">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size="3x"
          className="DeviceVideo__spinner"
        />
      </div>
    );
  }

  return (
    <div className="DeviceVideo  DeviceVideo--with-stream">
      {!playing && !error && (
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size="3x"
          className="DeviceVideo__spinner"
        />
      )}
      <video
        className="DeviceVideo__video"
        ref={videoRef}
        onCanPlay={play}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};
