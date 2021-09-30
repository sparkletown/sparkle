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
    isEnabled: isVideoEnabledExternally,
    ref: videoRef,
    handleToggle: toggleVideo,
    icon: videoIcon,
    iconColor: videoIconColor,
    iconClickable: videoIconClickable,
  } = useParticipantState("video", participant, defaultVideoHidden);

  const {
    isEnabled: isAudioEnabledExternally,
    ref: audioRef,
    handleToggle: toggleAudio,
    icon: audioIcon,
    iconColor: audioIconColor,
    iconClickable: audioIconClickable,
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
            "VideoParticipant__video-element--disabled": !isVideoEnabledExternally,
          })}
          ref={videoRef}
          autoPlay={true}
        />
        {!isVideoEnabledExternally && (
          <div className="VideoParticipant__video--placeholder" />
        )}
      </div>
      <audio ref={audioRef} autoPlay={true} muted={!isAudioEnabledExternally} />

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
          className={classNames({
            "VideoParticipant__controls--clickable": videoIconClickable,
          })}
          size="lg"
          icon={videoIcon}
          color={videoIconColor}
          onClick={toggleVideo}
        />

        <FontAwesomeIcon
          className={classNames({
            "VideoParticipant__controls--clickable": audioIconClickable,
          })}
          size="lg"
          icon={audioIcon}
          color={audioIconColor}
          onClick={toggleAudio}
        />
      </div>
    </div>
  );
};
