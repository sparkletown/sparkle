import { useContext, useState } from "react";

import { VideoCommsContext } from "../VideoComms/VideoComms";

export const useVideoHuddle = () => {
  const { joinChannel, disconnect, localParticipant, remoteParticipants } =
    useContext(VideoCommsContext);
  const [inHuddle, setInHuddle] = useState(false);

  // TODO Docs
  const joinHuddle = (huddleId: string) => {
    console.log("joining huddle");
    joinChannel(huddleId);
    setInHuddle(true);
  };

  // TODO Docs
  const leaveHuddle = () => {
    console.log("leaving huddle");
    disconnect();
    setInHuddle(false);
  };

  return {
    joinHuddle,
    leaveHuddle,
    inHuddle,
    localParticipant,
    remoteParticipants,
  };
};
