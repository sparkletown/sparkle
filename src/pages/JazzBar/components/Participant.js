import React, { useState, useEffect, useRef } from "react";
import UserProfileModal from "components/organisms/UserProfileModal";

const isBarman = (uid) => uid === "0eQgusXEyDf0fE2x1TGufLdy2iJ3"; // Ed is the barman

const Participant = ({ participant, children }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.participant.audioTracks));

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

    participant.participant.on("trackSubscribed", trackSubscribed);
    participant.participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.participant.removeAllListeners();
    };
  }, [participant.participant]);

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

  return (
    <div
      className={`col participant ${
        isBarman(participant.participant.identity) && "barman"
      }`}
    >
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} />
      <img
        onClick={() => setShowProfile(true)}
        key={participant.sid}
        className="profile-icon"
        src={
          participant.profileData.pictureUrl || "/anonymous-profile-icon.jpeg"
        }
        title={participant.profileData.partyName}
        alt={`${participant.profileData.partyName} profile`}
        width={40}
        height={40}
      />
      {showProfile && (
        <UserProfileModal
          show
          onHide={() => setShowProfile(false)}
          userProfile={participant.profileData}
        />
      )}
      {children}
    </div>
  );
};

export default Participant;
