import React, { useEffect, useRef } from "react";
import {
  faTv,
  faVideoSlash,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import classNames from "classnames";

import { User } from "types/User";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./Player.scss";

export interface VideoPlayerProps {
  user?: WithId<User>;
  videoTrack?: ILocalVideoTrack | IRemoteVideoTrack;
  audioTrack?: ILocalAudioTrack | IRemoteAudioTrack;
  showButtons?: boolean;
  isCamOn?: boolean;
  isMicOn?: boolean;
  isSharing?: boolean;
  toggleCam?: (user?: WithId<User>) => void;
  toggleMic?: (user?: WithId<User>) => void;
  containerClass?: string;
  isLocalPlayer?: boolean;
}

export const Player: React.FC<VideoPlayerProps> = ({
  user,
  videoTrack,
  audioTrack,
  showButtons = false,
  isCamOn,
  isMicOn,
  isSharing,
  toggleCam,
  toggleMic,
  containerClass,
  isLocalPlayer = false,
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || !videoTrack) return;

    videoTrack.play(container.current);

    return () => {
      videoTrack.stop();
    };
  }, [container, videoTrack]);

  useEffect(() => {
    if (!audioTrack) return;

    audioTrack.play();

    return () => {
      audioTrack.stop();
    };
  }, [audioTrack]);

  const iconContainerClasses = (isOn?: boolean) =>
    classNames("Player__icon", {
      "Player__icon--off": !isOn,
      "Player__icon--visible": !isOn || isLocalPlayer,
    });

  const avatarClasses = classNames("Player__avatar", {
    "Player__avatar--local": isLocalPlayer,
  });

  return (
    <div ref={container} className={classNames("Player", containerClass)}>
      <div className="Player__background" />
      {showButtons && (
        <div className="Player__overlay">
          <div className="Player__buttons">
            {(toggleMic || !isMicOn) && (
              <div
                className={iconContainerClasses(isMicOn)}
                onClick={() => {
                  toggleMic?.(user);
                }}
              >
                <FontAwesomeIcon icon={faVolumeMute} />
              </div>
            )}

            {(toggleCam || !isCamOn) && (
              <div
                className={iconContainerClasses(isCamOn)}
                onClick={() => {
                  toggleCam?.(user);
                }}
              >
                <FontAwesomeIcon icon={faVideoSlash} />
              </div>
            )}

            {isSharing && (
              <div className="Player__icon Player__icon--off">
                <FontAwesomeIcon icon={faTv} />
              </div>
            )}
          </div>
        </div>
      )}
      {user && <UserAvatar user={user} containerClassName={avatarClasses} />}
    </div>
  );
};
