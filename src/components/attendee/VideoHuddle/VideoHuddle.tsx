import React from "react";

import { useVideoHuddle } from "./useVideoHuddle";

import styles from "./VideoHuddle.module.scss";

interface VideoHuddleProps {
  userId: string;
}

export const VideoHuddle: React.FC<VideoHuddleProps> = ({ userId }) => {
  const { inHuddle } = useVideoHuddle();

  if (!inHuddle) {
    return <></>;
  }
  return <ActiveVideoHuddle userId={userId} />;
};

interface ActiveVideoHuddleProps {
  userId: string;
}

const ActiveVideoHuddle: React.FC<ActiveVideoHuddleProps> = ({ userId }) => {
  const { localParticipant, remoteParticipants, leaveHuddle } =
    useVideoHuddle();

  // TODO Think about how the API is used internally vs externally. Ideally it should all go through the same.

  return (
    <div className={styles.VideoHuddle}>
      <div className={styles.VideoHuddleControls}>
        <a id="video-control-leave" href="#!" onClick={leaveHuddle}>
          <span className="caption">Leave </span>
          <span className="icon"></span>
        </a>
        <a id="video-control-audio" href="#!">
          <span className="caption">Mute audio </span>
          <span className="icon"></span>
        </a>
        <a id="video-control-camera" href="#!">
          <span className="caption">Turn off camera </span>
          <span className="icon"></span>
        </a>
      </div>
      <div className={styles.VideoHuddleVideos}>
        {
          localParticipant /* && (
          <div className={styles.VideoContainer} key={localParticipant.sid}>
            <VideoParticipant
              participant={localParticipant}
              shouldMirrorVideo
            />
          </div>
        )*/
        }
        {
          remoteParticipants /*.map((participant) => (
          <div
            key={participant.participant.identity}
            className={styles.VideoContainer}
          >
            <VideoParticipant
              participant={participant.participant}
              participantUser={participant.user}
            />
          </div>
        ))*/
        }
      </div>
    </div>
  );
};