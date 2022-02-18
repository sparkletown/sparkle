import { VideoTrack } from "../VideoComms/types";

import { TwilioTrackDisplay } from "./internal/TwilioTrackDisplay";

interface VideoTrackDisplayProps {
  track: VideoTrack;
  isMirrored?: boolean;
}

/**
 * Low level component for displaying a single video track. In general, consider
 * using VideoCommsParticipant before this.
 */
export const VideoTrackDisplay: React.FC<VideoTrackDisplayProps> = ({
  track,
  isMirrored = false,
}) => {
  return track.enabled ? (
    <TwilioTrackDisplay isMirrored={isMirrored} track={track.twilioTrack} />
  ) : null;
};
