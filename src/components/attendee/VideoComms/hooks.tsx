import { useContext } from "react";

import { VideoCommsContext } from "./VideoComms";

export const useVideoComms = () => {
  return useContext(VideoCommsContext);
};
