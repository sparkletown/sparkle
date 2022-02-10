import {
  Participant,
  VideoSource,
  VideoTrack,
} from "components/attendee/VideoComms/types";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import { UserId } from "types/id";

import { useProfileById } from "hooks/user/useProfileById";

import { UserAvatar } from "components/atoms/UserAvatar";

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
  const { profile, isLoading } = useProfileById({
    userId: participant.sparkleId as UserId,
  });
  const hasActiveVideoStream = participant.videoTracks.some(
    (t) => t.sourceType === VideoSource.Webcam && t.enabled
  );

  return (
    <div key={participant.id} className={styles.huddleParticipant}>
      <VideoCommsParticipant
        participant={participant}
        videoTrackControls={addButtons}
        isLocal={isLocal}
      />

      {!hasActiveVideoStream && !isLoading && (
        <UserAvatar
          containerClassName={styles.avatarContainer}
          user={profile}
        />
      )}
    </div>
  );
};
