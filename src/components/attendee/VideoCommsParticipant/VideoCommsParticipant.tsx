import { useEffect, useRef } from "react";

import { Participant } from "../VideoComms/VideoComms";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
}

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // TODO handle multiple tracks
    if (participant.videoTracks?.[0] && videoRef.current) {
      const videoTrack = participant.videoTracks[0];
      videoTrack.attach(videoRef.current);
    }
  }, [participant.videoTracks]);

  // TODO Mirroring

  return (
    <>
      {participant.videoTracks?.[0] && (
        <video ref={videoRef} autoPlay={true} style={{ width: "400px" }} />
      )}
    </>
  );
};
