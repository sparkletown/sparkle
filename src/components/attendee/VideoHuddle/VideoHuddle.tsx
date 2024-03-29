import React from "react";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { HuddleParticipant } from "./internal/HuddleParticipant";
import { useVideoHuddle } from "./useVideoHuddle";

import styles from "./VideoHuddle.module.scss";

type VideoHuddleProps = {
  isFixed?: boolean;
};
export const VideoHuddle: React.FC<VideoHuddleProps> = ({ isFixed }) => {
  const {
    inHuddle,
    localParticipant,
    remoteParticipants,
    leaveHuddle,
  } = useVideoHuddle();

  if (!inHuddle) {
    return <></>;
  }

  const videoHuddleClasses = classNames(styles.VideoHuddle, {
    [styles.huddleFixed]: isFixed,
  });

  return (
    <div className={videoHuddleClasses}>
      <div className={styles.VideoHuddleControls}>
        <span onClick={leaveHuddle}>
          <span>Leave</span>
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
