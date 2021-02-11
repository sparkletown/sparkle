import React, { useCallback, useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import {
  faEye,
  faEyeSlash,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { ClassValue } from "classnames/types";

import { User } from "types/User";

import { WithId } from "utils/id";
import { isLocalParticipant } from "utils/twilio";

import { useParticipantState } from "hooks/twilio";

import UserProfileModal from "components/organisms/UserProfileModal";
import UserProfilePicture from "components/molecules/UserProfilePicture";

import "./VideoParticipant.scss";

export interface VideoParticipantProps {
  participant: LocalParticipant | RemoteParticipant;
  participantUser?: WithId<User>;

  showIcon?: boolean;
  defaultMute?: boolean;
  defaultVideoHidden?: boolean;
  additionalClassNames?: ClassValue;
}

export const VideoParticipant: React.FC<VideoParticipantProps> = ({
  participant,
  participantUser,

  showIcon = true,
  defaultMute = false,
  defaultVideoHidden = false,
  additionalClassNames,
}) => {
  const isMe = isLocalParticipant(participant);

  const shouldMirrorVideo = participantUser?.mirrorVideo ?? false;

  // Show/hide UserProfileModal
  const [isProfileVisible, setProfileVisible] = useState<boolean>(false);
  const showProfileModal = useCallback(() => setProfileVisible(true), []);
  const hideProfileModal = useCallback(() => setProfileVisible(false), []);

  const {
    videoTracks,
    audioTracks,

    isMuted,
    setMuted,
    toggleMuted,

    isVideoHidden,
    toggleVideoHidden,
    setVideoHidden,
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

    // TODO: can we move this into useParticipantState()?
    const hideVideo = () => setVideoHidden(true);
    const showVideo = () => setVideoHidden(false);

    videoTrack.on("enabled", showVideo);
    videoTrack.on("disabled", hideVideo);

    return () => {
      videoTrack.off("enabled", showVideo);
      videoTrack.off("disabled", hideVideo);

      videoTrack.detach();
    };
  }, [videoTrack, setVideoHidden]);

  // @debt should we be handling the other audio tracks?
  const audioTrack = audioTracks[0];
  useEffect(() => {
    if (!audioTrack) return;

    if (audioRef.current && !isMuted) {
      audioTrack.attach(audioRef.current);
    } else {
      audioTrack.detach();
    }

    // TODO: can we move this into useParticipantState()?
    const muteAudio = () => setMuted(true);
    const unmuteAudio = () => setMuted(false);

    audioTrack.on("enabled", unmuteAudio);
    audioTrack.on("disabled", muteAudio);

    return () => {
      audioTrack.off("enabled", unmuteAudio);
      audioTrack.off("disabled", muteAudio);

      audioTrack.detach();
    };
  }, [audioTrack, isMuted, setMuted]);

  const micIconMe = isMuted ? faMicrophoneSlash : faMicrophone;
  const micIconOther = isMuted ? faVolumeMute : faVolumeUp;
  const micIcon = isMe ? micIconMe : micIconOther;
  const micIconColor = isMuted ? "red" : undefined;

  const videoIconMe = isVideoHidden ? faVideoSlash : faVideo;
  const videoIconOther = isVideoHidden ? faEyeSlash : faEye;
  const videoIcon = isMe ? videoIconMe : videoIconOther;
  const videoIconColor = isVideoHidden ? "red" : undefined;

  return (
    <div
      className={classNames(
        "video-participant",
        {
          "video-participant--mirrored": shouldMirrorVideo,
        },
        additionalClassNames
      )}
    >
      <div className="video-participant__video">
        <video ref={videoRef} autoPlay={true} />
        <audio ref={audioRef} autoPlay={true} />
      </div>

      {showIcon && participantUser && (
        <div className="video-participant__profile">
          <UserProfilePicture
            user={participantUser}
            setSelectedUserProfile={showProfileModal}
          />

          <UserProfileModal
            userProfile={participantUser}
            show={isProfileVisible}
            onHide={hideProfileModal}
          />
        </div>
      )}

      <div className="video-participant__controls">
        <FontAwesomeIcon
          size="lg"
          icon={videoIcon}
          color={videoIconColor}
          onClick={toggleVideoHidden}
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
