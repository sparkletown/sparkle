import { useContext } from "react";

import { VideoCommsContext } from "./VideoComms";

export const useVideoComms = () => {
  const {
    status,
    localParticipant,
    remoteParticipants,
    joinChannel,
    disconnect,
    shareScreen,
  } = useContext(VideoCommsContext);

  return {
    status,
    localParticipant,
    remoteParticipants,
    joinChannel,
    disconnect,
    shareScreen,
  };
};
