import { Participant } from "components/attendee/VideoComms/types";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import styles from "./HuddleParticipant.module.scss";

interface HuddleParticipantProps {
  participant: Participant;
  isLocal?: boolean;
}

export const HuddleParticipant: React.FC<HuddleParticipantProps> = ({
  participant,
  isLocal = false,
}) => {
  return (
    <div key={participant.sparkleId} className={styles.huddleParticipant}>
      <VideoCommsParticipant participant={participant} isLocal={isLocal} />
    </div>
  );
};
