import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Video from "twilio-video";

import { DEFAULT_CAMERA_ENABLED } from "settings";

import { User } from "types/User";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";

import { CameraMicrophoneControls } from "components/molecules/CameraMicrophoneControls";
import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import { VideoOverlayButton } from "components/atoms/VideoOverlayButton";

export interface ParticipantProps {
  defaultMute?: boolean;
  participant: Video.Participant;
  profileData: User;
  profileDataId: string;
  showIcon?: boolean;
  isAudioEffectDisabled?: boolean;
}

type VideoTracks = Array<Video.LocalVideoTrack | Video.RemoteVideoTrack>;
type AudioTracks = Array<Video.LocalAudioTrack | Video.RemoteAudioTrack>;
type Track = VideoTracks[number] | AudioTracks[number];

export const Participant: React.FC<ParticipantProps> = ({
  participant,
  profileData,
  defaultMute = false,
  showIcon = true,
  isAudioEffectDisabled,
}) => {
  const isCurrentUser = useIsCurrentUser(participant.identity);
  const [videoTracks, setVideoTracks] = useState<VideoTracks>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTracks>([]);

  const [videoEnabled, setVideoEnabled] = useState(DEFAULT_CAMERA_ENABLED);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const videoTrackpubsToTracks = (trackMap: Video.Participant["videoTracks"]) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null) as VideoTracks;

  const audioTrackpubsToTracks = (trackMap: Video.Participant["audioTracks"]) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null) as AudioTracks;

  useEffect(
    () =>
      participant.videoTracks.forEach((x) => {
        // Video mute handling: for user's own video
        x?.track?.on("enabled", () => setVideoEnabled(true));
        x?.track?.on("disabled", () => setVideoEnabled(false));
      }),
    [participant.videoTracks]
  );

  useEffect(() => {
    setVideoTracks(videoTrackpubsToTracks(participant.videoTracks));
    setAudioTracks(audioTrackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track: Track) => {
      if (track.kind === "video") {
        // Video mute handling: for other participants' videos
        track.on("enabled", () => setVideoEnabled(true));
        track.on("disabled", () => setVideoEnabled(false));
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track: Track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack && videoRef.current) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack && audioRef.current) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  const changeAudioState = useCallback(
    (enable: boolean) => {
      if (!enable) {
        audioTracks?.[0]?.detach();
      } else {
        const audioTrack = audioTracks[0];
        if (audioTrack && audioRef.current) {
          audioTrack.attach(audioRef.current);
        }
      }
    },
    [audioTracks]
  );

  const videoAndAudio = useMemo(
    () => (
      <>
        <video
          ref={videoRef}
          autoPlay={true}
          className={profileData?.mirrorVideo ? "mirrored" : ""}
        />
        <audio ref={audioRef} autoPlay={true} />
      </>
    ),
    [profileData]
  );

  return (
    <div className={"col participant"}>
      {!videoEnabled && <div className="participant--video-disabled" />}
      {videoAndAudio}
      {showIcon && (
        <div className="profile-icon">
          <UserProfilePicture
            user={{ ...profileData, id: participant.identity }}
            reactionPosition="right"
            isAudioEffectDisabled={isAudioEffectDisabled}
          />
        </div>
      )}
      {isCurrentUser && (
        <CameraMicrophoneControls
          containerClassName="mute-container"
          participant={participant}
          defaultMute={defaultMute}
        />
      )}
      <VideoOverlayButton
        containerClassName={"mute-other-container"}
        variant="audio"
        defaultValue={!defaultMute}
        onEnabledChanged={changeAudioState}
      />
    </div>
  );
};
