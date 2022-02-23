import { useContext } from "react";

import { VideoHuddleContext } from "./VideoHuddle";

export const useVideoHuddle = () => {
  const { setChannelId, channelId } = useContext(VideoHuddleContext);

  // TODO Docs
  const joinHuddle = (huddleId: string) => {
    setChannelId(huddleId);
  };

  // TODO Docs
  const leaveHuddle = () => {
    setChannelId(undefined);
    console.log("leaving huddle");
  };

  return {
    joinHuddle,
    leaveHuddle,
    inHuddle: channelId !== undefined,
  };
};
