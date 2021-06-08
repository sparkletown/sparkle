import React, { useRef, useEffect } from "react";
import classNames from "classnames";
import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import "./Player.scss";

import { WithId } from "utils/id";

import { User } from "types/User";

import { UserAvatar } from "components/atoms/UserAvatar";

import VolumeMutedIcon from "assets/icons/volume-muted-icon.svg";
import CameraOffIcon from "assets/icons/camera-off-icon.svg";
import StreamingIcon from "assets/icons/streaming-icon.svg";

export interface VideoPlayerProps {
  user?: WithId<User>;
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
  user,
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

  // TODO: detect how to find sharing player
  // const containerClasses = () =>
  //   classNames("video-player", {
  //     'video-player--sharing': isSharing,
  //   });

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
            <UserAvatar user={user} containerClassName="icon-container" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
