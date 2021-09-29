import React, { useEffect, useRef } from "react";
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
  const isMe = isLocalParticipant(participant);
  const shouldMirrorVideo = participantUser?.mirrorVideo ?? false;

  const {
    videoTracks,
    audioTracks,

    isMuted,
    muteAudio,
    unmuteAudio,
    toggleMuted,

    isVideoShown,
    toggleVideo,
    showVideo,
    hideVideo,
  } = useParticipantState({
    participant,
    defaultMute,
    defaultVideoHidden,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // @debt should we be handling the other video tracks here?
  const videoTrack = videoTracks[0];
  useEffect(() => {
    if (!videoTrack) return;

    videoRef.current
      ? videoTrack.attach(videoRef.current)
      : videoTrack.detach();

    videoTrack.on("enabled", showVideo);
    videoTrack.on("disabled", hideVideo);

    return () => {
      videoTrack.off("enabled", showVideo);
      videoTrack.off("disabled", hideVideo);

      videoTrack.detach();
    };
  }, [videoTrack, showVideo, hideVideo]);

  // @debt should we be handling the other audio tracks?
  const audioTrack = audioTracks[0];
  useEffect(() => {
    if (!audioTrack) return;

    if (audioRef.current && !isMuted) {
      audioTrack.attach(audioRef.current);
    } else {
      audioTrack.detach();
    }

    audioTrack.on("enabled", unmuteAudio);
    audioTrack.on("disabled", muteAudio);

    return () => {
      audioTrack.off("enabled", unmuteAudio);
      audioTrack.off("disabled", muteAudio);

      audioTrack.detach();
    };
  }, [audioTrack, isMuted, muteAudio, unmuteAudio]);

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
          onClick={toggleMuted}
        />
      </div>
    </div>
  );
};
