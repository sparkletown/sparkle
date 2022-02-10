import React, { useCallback } from "react";

import { VideoTrack } from "../VideoComms/types";

import { ExtraButton } from "./internal/ExtraButton";
import { HuddleParticipant } from "./internal/HuddleParticipant";
import { useVideoHuddle } from "./useVideoHuddle";

import styles from "./VideoHuddle.module.scss";

interface VideoHuddleProps {
  userId: string;
}

export const VideoHuddle: React.FC<VideoHuddleProps> = ({ userId }) => {
  const {
    inHuddle,
    extraButtons,
    localParticipant,
    remoteParticipants,
    leaveHuddle,
  } = useVideoHuddle();

  const addButtons = useCallback(
    (track: VideoTrack) => {
      return (
        <>
          {extraButtons.map((buttonConfig, idx) => (
            <ExtraButton key={idx} buttonConfig={buttonConfig} track={track} />
          ))}
        </>
      );
    },
    [extraButtons]
  );

  if (!inHuddle) {
    return <></>;
  }

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
        {localParticipant && (
          <HuddleParticipant
            key={localParticipant.id}
            participant={localParticipant}
            addButtons={addButtons}
            isLocal
          />
        )}
        {remoteParticipants.map((participant) => (
          <HuddleParticipant
            key={participant.id}
            participant={participant}
            addButtons={addButtons}
          />
        ))}
      </div>
    </div>
  );
};
