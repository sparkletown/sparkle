import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useVideoParticipant } from "hooks/twilio/useVideoParticipant";

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
    ref: videoRef,
    handleToggle: handleVideoToggle,
    icon: videoIcon,
    iconColor: videoIconColor,
  } = useVideoParticipant("video", participant, defaultVideoHidden);

  const {
    ref: audioRef,
    handleToggle: handleAudioToggle,
    icon: audioIcon,
    iconColor: audioIconColor,
  } = useVideoParticipant("audio", participant, defaultMute);

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
        <video ref={videoRef} autoPlay={true} />
        <audio ref={audioRef} autoPlay={true} />
      </div>

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
          onClick={handleVideoToggle}
        />

        <FontAwesomeIcon
          size="lg"
          icon={audioIcon}
          color={audioIconColor}
          onClick={handleAudioToggle}
        />
      </div>
    </div>
  );
};
