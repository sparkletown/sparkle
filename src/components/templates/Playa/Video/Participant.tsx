import React, { useState, useEffect, useRef, useMemo } from "react";
import Video from "twilio-video";
import { User } from "types/User";
import { WithId } from "utils/id";

export interface ParticipantProps {
  participant: Video.Participant;
  user: WithId<User>;
  setSelectedUserProfile: (user: WithId<User>) => void;
}

type VideoTracks = Array<Video.LocalVideoTrack | Video.RemoteVideoTrack>;
type AudioTracks = Array<Video.LocalAudioTrack | Video.RemoteAudioTrack>;
type Track = VideoTracks[number] | AudioTracks[number];

const Participant: React.FC<React.PropsWithChildren<ParticipantProps>> = ({
  participant,
  user,
  children,
  setSelectedUserProfile,
}) => {
  const [videoTracks, setVideoTracks] = useState<VideoTracks>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTracks>([]);

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

  const videos = useMemo(
    () => (
      <>
        <video ref={videoRef} autoPlay={true} />
        <audio ref={audioRef} autoPlay={true} />
      </>
    ),
    []
  );

  return (
    <div className="participant">
      {videos}
      <div className="name" onClick={() => setSelectedUserProfile(user)}>
        {user.partyName}
      </div>
      {children}
    </div>
  );
};

export default Participant;
