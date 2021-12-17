import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useParticipantState } from "hooks/twilio/useParticipantState";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import "./VideoParticipant.scss";

export interface VideoParticipantProps extends ContainerClassName {
  participant: LocalParticipant | RemoteParticipant;
  participantUser?: WithId<User>;

  showIcon?: boolean;
  defaultMute?: boolean;
  defaultVideoHidden?: boolean;

  isAudioEffectDisabled?: boolean;
}

export const VideoParticipant: React.FC<VideoParticipantProps> = ({
  participant,
  participantUser,
  showIcon = true,
  defaultMute = false,
  defaultVideoHidden = false,
  containerClassName,
  isAudioEffectDisabled,
}) => {
  const shouldMirrorVideo = participantUser?.mirrorVideo ?? false;

  const {
    shouldDisableExternally: shouldDisableVideoExternally,
    ref: videoRef,
    handleToggle: toggleVideo,
    icon: videoIcon,
    iconColor: videoIconColor,
  } = useParticipantState("video", participant, defaultVideoHidden);

  const {
    shouldDisableExternally: shouldDisableAudioExternally,
    ref: audioRef,
    handleToggle: toggleAudio,
    icon: audioIcon,
    iconColor: audioIconColor,
  } = useParticipantState("audio", participant, defaultMute);

  return (
    <div
      className={classNames(
        "VideoParticipant",
        {
          "VideoParticipant--mirrored": shouldMirrorVideo,
        },
        containerClassName
      )}
    >
      <div className="VideoParticipant__video">
        <video
          className={classNames("VideoParticipant__video-element", {
            "VideoParticipant__video-element--disabled": shouldDisableVideoExternally,
          })}
          ref={shouldDisableVideoExternally ? null : videoRef}
          autoPlay={true}
        />
      </div>
      <audio
        ref={audioRef}
        autoPlay={true}
        muted={shouldDisableAudioExternally}
      />

      {showIcon && participantUser && (
        <div className="VideoParticipant__profile">
          <UserProfilePicture
            user={participantUser}
            reactionPosition="right"
            isAudioEffectDisabled={isAudioEffectDisabled}
          />
        </div>
      )}

      <div className="VideoParticipant__controls">
        <FontAwesomeIcon
          size="lg"
          icon={videoIcon}
          color={videoIconColor}
          onClick={toggleVideo}
        />

        <FontAwesomeIcon
          size="lg"
          icon={audioIcon}
          color={audioIconColor}
          onClick={toggleAudio}
          className="VideoParticipant__controls-mute"
        />
      </div>
    </div>
  );
};
