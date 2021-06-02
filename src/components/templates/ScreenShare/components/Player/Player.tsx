import React, { useRef, useEffect } from "react";
import classNames from "classnames";
import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import "./Player.scss";

import VolumeMutedIcon from "assets/icons/volume-muted-icon.svg";
import CameraOffIcon from "assets/icons/camera-off-icon.svg";
import StreamingIcon from "assets/icons/streaming-icon.svg";

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack?: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  showButtons?: boolean;
  isCamOn?: boolean;
  isMicOn?: boolean;
  isSharing?: boolean;
  toggleCam?: () => void;
  toggleMic?: () => void;
}

const Player = ({
  videoTrack,
  audioTrack,
  showButtons = false,
  isCamOn,
  isMicOn,
  isSharing,
  toggleCam,
  toggleMic,
}: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    videoTrack?.play(container.current);
    return () => {
      videoTrack?.stop();
    };
  }, [container, videoTrack]);

  useEffect(() => {
    audioTrack?.play();
    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack]);

  const IconContainerClasses = (isOn: boolean) =>
    classNames("icon-container", {
      on: isOn,
    });

  return (
    <div ref={container} className="video-player">
      {showButtons && (
        <div className="overlay">
          <div className="buttons">
            <div
              className={IconContainerClasses(!isMicOn)}
              onClick={() => {
                toggleMic && toggleMic();
              }}
            >
              <img src={VolumeMutedIcon} alt="volume-muted-icon" />
            </div>

            <div
              className={IconContainerClasses(!isCamOn)}
              onClick={() => {
                toggleCam && toggleCam();
              }}
            >
              <img
                src={CameraOffIcon}
                alt="camera-off-icon"
                className="camera-off"
              />
            </div>

            {isSharing && (
              <div className={IconContainerClasses(true)}>
                <img src={StreamingIcon} alt="streaming-icon" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
