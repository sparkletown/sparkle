import { AudioTrackPlayer } from "../VideoComms/AudioTrackPlayer";
import { LocalParticipant, Participant } from "../VideoComms/types";
import { VideoTrackDisplay } from "../VideoComms/VideoTrackDisplay";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
}

interface VideoCommsControlsProps {
  participant: LocalParticipant;
}

const VideoCommsControls: React.FC<VideoCommsControlsProps> = ({
  participant,
}) => {
  return (
    <>
      {participant.isTransmittingAudio ? (
        <span onClick={participant.stopAudio}>Mute</span>
      ) : (
        <span onClick={participant.startAudio}>Unmute</span>
      )}
      {participant.isTransmittingVideo ? (
        <span onClick={participant.stopVideo}>Hide</span>
      ) : (
        <span onClick={participant.startVideo}>Reveal</span>
      )}
    </>
  );
};

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
  isLocal,
}) => {
  // TODO Mirroring

  return (
    <>
      {participant.videoTracks.map((track) => (
        <VideoTrackDisplay key={track.id} track={track} />
      ))}
      {participant.audioTracks.map((track) => (
        <AudioTrackPlayer key={track.id} track={track} />
      ))}
      {isLocal && (
        <VideoCommsControls participant={participant as LocalParticipant} />
      )}
    </>
  );
};
