import React, { useState, useEffect, useRef } from "react";
import UserProfileModal from "components/organisms/UserProfileModal";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Participant = ({ participant, profileData, bartender, children }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [muted, setMuted] = useState(false);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
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
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
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
      if (audioTrack) {
        audioTrack.attach(audioRef.current);
      }
    }
  }, [participant, muted, audioTracks]);

  return (
    <div className={`col participant ${bartender ? "bartender" : ""}`}>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} />
      <img
        onClick={() => setShowProfile(true)}
        key={participant.sid}
        className="profile-icon"
        src={profileData?.pictureUrl || "/anonymous-profile-icon.jpeg"}
        title={profileData.partyName}
        alt={`${profileData.partyName} profile`}
        width={40}
        height={40}
      />
      {showProfile && (
        <UserProfileModal
          show
          onHide={() => setShowProfile(false)}
          userProfile={profileData}
        />
      )}
      {children}
      <div className="mute-other-container">
        <div onClick={() => setMuted(!muted)}>
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
