import React, { useCallback, useEffect, useMemo, useState } from "react";
import { noop } from "lodash";

import { TwilioImplementation } from "./internal/TwilioImplementation";
import {
  StateUpdateCallbackContext,
  VideoCommsContextType,
  VideoCommsStatus,
} from "./types";

interface VideoCommsProviderProps {
  children: React.ReactNode;
}

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

/**
 * The VideoCommsProvider provides an API for interacting with video comms.
 * It uses a single instance of TwilioImplementation that lasts for the entire
 * lifecycle of the component. It is expected that only one VideoCommsProvider
 * is in existence at any one time and that it is kept mounted between route
 * changes in the attendee experience - thus allowing for persistent
 * video chat as attendees move around.
 *
 * The implementation of Twilio has been done outside of React as attempting
 * to use React hooks with Twilio led to convoluted code that was hard to
 * follow, hard to debug and often re-rendered unexpectedly.
 *
 * It is expected that developers wanting to add video comms to their
 * spaces will use the components *outside* of the `internal` folder. The
 * internal components are low level primitives that are used by the higher
 * level components.
 */
export const VideoCommsProvider: React.FC<VideoCommsProviderProps> = ({
  children,
}) => {
  const [commsStatus, setCommsState] = useState<StateUpdateCallbackContext>({
    status: VideoCommsStatus.Disconnected,
    remoteParticipants: [],
    isTransmittingAudio: false,
    isTransmittingVideo: false,
  });

  const twilioCallback = useCallback((update: StateUpdateCallbackContext) => {
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
