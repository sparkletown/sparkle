import React from "react";
import classNames from "classnames";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useParticipantState } from "hooks/twilio/useParticipantState";

import styles from "./VideoParticipant.module.scss";

export interface VideoParticipantProps extends ContainerClassName {
  participant: LocalParticipant | RemoteParticipant;
  participantUser?: WithId<User>;

  showIcon?: boolean;
  defaultMute?: boolean;
  defaultVideoHidden?: boolean;

  isAudioEffectDisabled?: boolean;
  shouldMirrorVideo?: boolean;
}

export const VideoParticipant: React.FC<VideoParticipantProps> = ({
  participant,
  participantUser,
  showIcon = true,
  defaultMute = false,
  defaultVideoHidden = false,
  containerClassName,
  isAudioEffectDisabled,
  shouldMirrorVideo = false,
}) => {
  const {
    shouldDisableExternally: shouldDisableVideoExternally,
    ref: videoRef,
  } = useParticipantState("video", participant, defaultVideoHidden);

  const videoClassNames = classNames({
    [styles.Mirrored]: shouldMirrorVideo,
  });

  return (
    <>
      <video
        className={videoClassNames}
        ref={shouldDisableVideoExternally ? null : videoRef}
        autoPlay={true}
      />
      {/*
      TODO
      Audio is disabled
      <audio
        ref={audioRef}
        autoPlay={true}
        muted={shouldDisableAudioExternally}
      />
      */}

      {/*
      TODO
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
    */}
    </>
  );
};
