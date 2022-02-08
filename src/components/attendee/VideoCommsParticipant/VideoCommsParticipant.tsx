import { AudioTrackPlayer } from "../VideoComms/AudioTrackPlayer";
import { useVideoComms } from "../VideoComms/hooks";
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
  const {
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    isTransmittingAudio,
    isTransmittingVideo,
  } = useVideoComms();

  return (
    <>
      {isTransmittingAudio ? (
        <span onClick={stopAudio}>Mute</span>
      ) : (
        <span onClick={startAudio}>Unmute</span>
      )}
      {isTransmittingVideo ? (
        <span onClick={stopVideo}>Hide</span>
      ) : (
        <span onClick={startVideo}>Reveal</span>
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
