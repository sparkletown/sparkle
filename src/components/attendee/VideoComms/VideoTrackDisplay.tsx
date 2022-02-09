import { VideoTrack } from "../VideoComms/types";

import { TwilioTrackDisplay } from "./internal/TwilioTrackDisplay";

interface VideoTrackDisplayProps {
  track: VideoTrack;
  isMirrored?: boolean;
}

export const VideoTrackDisplay: React.FC<VideoTrackDisplayProps> = ({
  track,
  isMirrored = false,
}) => {
  return (
    <>
      {track.enabled ? (
        <>
          <TwilioTrackDisplay
            isMirrored={isMirrored}
            track={track.twilioTrack}
          />
        </>
      ) : (
        <span>Video disabled</span>
      )}
    </>
  );
};
