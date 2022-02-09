import { useContext } from "react";

import { VideoCommsContext } from "./VideoCommsProvider";

export const useVideoComms = () => {
  return useContext(VideoCommsContext);
};
