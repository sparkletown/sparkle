import React, { useCallback, useEffect, useMemo, useState } from "react";
import { noop } from "lodash";

import { TwilioImplementation } from "./internal/TwilioImplementation";
import {
  StateUpdateCallbackParams,
  VideoCommsContextType,
  VideoCommsProviderProps,
  VideoCommsStatus,
} from "./types";

export const VideoCommsContext = React.createContext<VideoCommsContextType>({
  status: VideoCommsStatus.Disconnected,
  joinChannel: noop,
  disconnect: noop,
  remoteParticipants: [],
  shareScreen: noop,
  startAudio: noop,
  stopAudio: noop,
  startVideo: noop,
  stopVideo: noop,
  isTransmittingAudio: false,
  isTransmittingVideo: false,
});

export const VideoCommsProvider: React.FC<VideoCommsProviderProps> = ({
  userId,
  children,
}) => {
  const [commsStatus, setCommsState] = useState<StateUpdateCallbackParams>({
    status: VideoCommsStatus.Disconnected,
    remoteParticipants: [],
    isTransmittingAudio: false,
    isTransmittingVideo: false,
  });

  const twilioCallback = useCallback((update: StateUpdateCallbackParams) => {
    setCommsState(update);
  }, []);

  const twilioImpl = useMemo(() => TwilioImplementation(twilioCallback), [
    twilioCallback,
  ]);

  useEffect(() => {
    // This gives us a reasonably good chance of disconnecting from any ongoing
    // sessions when the user navigates away. It is not 100% guaranteed.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#usage_notes
    window.addEventListener("beforeunload", (event) => {
      twilioImpl.disconnect();
    });
  }, [twilioImpl]);

  const contextState: VideoCommsContextType = {
    ...commsStatus,
    joinChannel: twilioImpl.joinChannel,
    disconnect: twilioImpl.disconnect,
    shareScreen: twilioImpl.shareScreen,
    startAudio: twilioImpl.startAudio,
    stopAudio: twilioImpl.stopAudio,
    startVideo: twilioImpl.startVideo,
    stopVideo: twilioImpl.stopVideo,
  };

  return (
    <VideoCommsContext.Provider value={contextState}>
      {children}
    </VideoCommsContext.Provider>
  );
};
