import React, { useState, useEffect, useRef, useMemo } from "react";

// Components
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserProfileModal from "components/organisms/UserProfileModal";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import Video from "twilio-video";

// Typings
import { User } from "types/User";

export interface ParticipantProps {
  bartender?: User;
  defaultMute?: boolean;
  participant: Video.Participant;
  profileData: User;
  profileDataId: string;
  showIcon?: boolean;
}

type VideoTracks = Array<Video.LocalVideoTrack | Video.RemoteVideoTrack>;
type AudioTracks = Array<Video.LocalAudioTrack | Video.RemoteAudioTrack>;
type Track = VideoTracks[number] | AudioTracks[number];

const Participant: React.FC<React.PropsWithChildren<ParticipantProps>> = ({
  participant,
  profileData,
  bartender,
  children,
  defaultMute = false,
  showIcon = true,
}) => {
  const [videoTracks, setVideoTracks] = useState<VideoTracks>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTracks>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [muted, setMuted] = useState(defaultMute);

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

  useEffect(() => {
    setVideoTracks(videoTrackpubsToTracks(participant.videoTracks));
    setAudioTracks(audioTrackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track: Track) => {
      if (track.kind === "video") {
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

  useEffect(() => {
    if (muted) {
      const audioTrack = audioTracks[0];
      if (audioTrack) {
        audioTrack.detach();
      }
    } else {
      const audioTrack = audioTracks[0];
      if (audioTrack && audioRef.current) {
        audioTrack.attach(audioRef.current);
      }
    }
  }, [participant, muted, audioTracks]);

  const videos = useMemo(
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
    <div className={`col participant ${bartender ? "bartender" : ""}`}>
      {videos}
      {showIcon && (
        <div className="profile-icon">
          <UserProfilePicture
            user={{ ...profileData, id: participant.identity }}
            setSelectedUserProfile={() => setShowProfile(true)}
          />
        </div>
      )}
      <UserProfileModal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        userProfile={{ ...profileData, id: participant.identity }}
      />
      {children}
      <div className="mute-other-container">
        <div onClick={() => setMuted(!muted)} id="mute-myself">
          <FontAwesomeIcon
            size="lg"
            icon={muted ? faVolumeMute : faVolumeUp}
            color={muted ? "red" : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Participant;
