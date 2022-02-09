import { VideoTrack } from "../VideoComms/types";

import { TwilioTrackDisplay } from "./internal/TwilioTrackDisplay";

interface VideoTrackDisplayProps {
  track: VideoTrack;
}

export const VideoTrackDisplay: React.FC<VideoTrackDisplayProps> = ({
  track,
}) => {
  return (
    <>
      {track.enabled ? (
        <>
          <TwilioTrackDisplay track={track.twilioTrack} />
        </>
      ) : (
        <span>Video disabled</span>
      )}
    </>
  );
};
