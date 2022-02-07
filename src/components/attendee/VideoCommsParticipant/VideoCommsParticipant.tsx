import { useEffect, useRef } from "react";

import { Participant } from "../VideoComms/types";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
}

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const firstTrack = participant.videoTracks?.[0];

  useEffect(() => {
    // TODO handle multiple tracks
    if (firstTrack && videoRef.current) {
      firstTrack.attach(videoRef.current);
    }
  }, [firstTrack]);

  // TODO Mirroring

  return (
    <>
      {participant.videoTracks?.[0] && (
        <video ref={videoRef} autoPlay={true} style={{ width: "400px" }} />
      )}
    </>
  );
};
