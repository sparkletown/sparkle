import { Participant, VideoTrack } from "components/attendee/VideoComms/types";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import styles from "./HuddleParticipant.module.scss";

interface HuddleParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  addButtons: (track: VideoTrack) => JSX.Element;
}

export const HuddleParticipant: React.FC<HuddleParticipantProps> = ({
  participant,
  isLocal = false,
  addButtons,
}) => {
  return (
    <div key={participant.id} className={styles.huddleParticipant}>
      <VideoCommsParticipant
        participant={participant}
        videoTrackControls={addButtons}
        isLocal={isLocal}
      />
    </div>
  );
};
