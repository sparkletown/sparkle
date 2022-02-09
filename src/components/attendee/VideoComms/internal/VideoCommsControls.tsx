import { useVideoComms } from "../hooks";

interface VideoCommsControlsProps {}

export const VideoCommsControls: React.FC<VideoCommsControlsProps> = () => {
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
