import { useContext } from "react";

import { VideoCommsContext } from "./VideoCommsProvider";

export const useVideoComms = () => {
  // This might seem a little pointless. However, we expect that in the future
  // this hook might do a little bit more than just get the context.
  return useContext(VideoCommsContext);
};
