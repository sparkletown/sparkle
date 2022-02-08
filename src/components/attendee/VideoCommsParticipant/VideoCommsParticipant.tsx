import { Participant } from "../VideoComms/types";
import { VideoTrackDisplay } from "../VideoComms/VideoTrackDisplay";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
}

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
}) => {

  // TODO Mirroring

  return (
    <>
      {participant.videoTracks.map((track) => (
        <VideoTrackDisplay key={track.id} track={track} />
      ))}
    </>
  );
};
