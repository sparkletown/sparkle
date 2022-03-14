import React from "react";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { HuddleParticipant } from "./internal/HuddleParticipant";
import { useVideoHuddle } from "./useVideoHuddle";

import styles from "./VideoHuddle.module.scss";

export const VideoHuddle: React.FC = () => {
  const {
    inHuddle,
    localParticipant,
    remoteParticipants,
    leaveHuddle,
  } = useVideoHuddle();

  if (!inHuddle) {
    return <></>;
  }

  return (
    <div className={styles.VideoHuddle}>
      <div className={styles.VideoHuddleControls}>
        <span onClick={leaveHuddle}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </span>
      </div>
      <div className={styles.VideoHuddleVideos}>
        {localParticipant && (
          <HuddleParticipant
            key={localParticipant.sparkleId}
            participant={localParticipant}
            isLocal
          />
        )}
        {remoteParticipants.map((participant) => (
          <HuddleParticipant
            key={participant.sparkleId}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
};
