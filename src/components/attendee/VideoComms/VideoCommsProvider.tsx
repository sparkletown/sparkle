import React, { useCallback, useEffect, useMemo, useState } from "react";
import { noop } from "lodash";

import { TwilioImpl } from "./internal/TwilioImplementation";
import {
  LocalParticipant,
  Participant,
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
  const [status, setStatus] = useState<VideoCommsStatus>(
    VideoCommsStatus.Disconnected
  );
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant>();
  const [remoteParticipants, setRemoteParticipants] = useState<Participant[]>(
    []
  );
  const [isTransmittingAudio, setIsTransmittingAudio] = useState(true);
  const [isTransmittingVideo, setIsTransmittingVideo] = useState(true);

  const twilioCallback = useCallback((update: StateUpdateCallbackParams) => {
    // TODO All these state updates should be batched into one.
    setLocalParticipant(update.localParticipant);
    setStatus(update.status);
    setRemoteParticipants(update.remoteParticipants);
    setIsTransmittingAudio(update.isTransmittingAudio);
    setIsTransmittingVideo(update.isTransmittingVideo);
  }, []);

  const twilioImpl = useMemo(() => TwilioImpl(twilioCallback), [
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
    status,
    localParticipant,
    remoteParticipants,
    joinChannel: twilioImpl.joinChannel,
    disconnect: twilioImpl.disconnect,
    shareScreen: twilioImpl.shareScreen,
    isTransmittingAudio,
    isTransmittingVideo,
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
