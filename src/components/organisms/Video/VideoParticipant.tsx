import React, { useRef } from "react";
import {
  faEye,
  faEyeSlash,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";
import { isLocalParticipant } from "utils/twilio";

import { useParticipantMediaState } from "hooks/twilio/useParticipantMediaState";

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
  const isMe = isLocalParticipant(participant);
  const shouldMirrorVideo = participantUser?.mirrorVideo ?? false;

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    isEnabled: isVideoShown,
    toggle: toggleVideo,
  } = useParticipantMediaState(
    "video",
    videoRef,
    participant,
    defaultVideoHidden
  );
  const {
    isEnabled: isAudioShown,
    toggle: toggleAudio,
  } = useParticipantMediaState("audio", audioRef, participant, defaultMute);

  const isMuted = !isAudioShown;

  const micIconMe = isMuted ? faMicrophoneSlash : faMicrophone;
  const micIconOther = isMuted ? faVolumeMute : faVolumeUp;
  const micIcon = isMe ? micIconMe : micIconOther;
  const micIconColor = isMuted ? "red" : undefined;

  const videoIconMe = isVideoShown ? faVideo : faVideoSlash;
  const videoIconOther = isVideoShown ? faEye : faEyeSlash;
  const videoIcon = isMe ? videoIconMe : videoIconOther;
  const videoIconColor = isVideoShown ? undefined : "red";

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
          onClick={toggleVideo}
        />

        <FontAwesomeIcon
          size="lg"
          icon={micIcon}
          color={micIconColor}
          onClick={toggleAudio}
        />
      </div>
    </div>
  );
};
