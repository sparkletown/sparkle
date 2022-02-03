import React, { useCallback, useState } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { ParticipantWithUser } from "types/rooms";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";

interface VideoCommsContextType {
  channelId?: string;
  joinChannel: (channelId?: string) => void;
  disconnect: () => void;

  localParticipant?: LocalParticipant;
  remoteParticipants: ParticipantWithUser<RemoteParticipant>[];
}

export const VideoCommsContext = React.createContext<VideoCommsContextType>({
  joinChannel: () => {},
  disconnect: () => {},
  remoteParticipants: [],
});

interface VideoCommsProviderProps {
  userId: string;
  children: React.ReactNode;
}

export const VideoCommsProvider: React.FC<VideoCommsProviderProps> = ({
  userId,
  children,
}) => {
  // TODO Consider whether this should be split into multiple providers:
  //  - One for the general state of "am I in a call"
  //  - One for the participants etc etc
  const [channelId, setChannelId] = useState<string>();

  // @debt This logic is messy and wants simplifying down. For now, trying to
  // provide a unifying API around video comms that can be used everywhere. The
  // tech debt is all contained.
  const {
    localParticipant,
    participants,
    disconnect: videoDisconnect,
  } = useVideoRoomState(userId, channelId);

  const disconnectCallback = useCallback(() => {
    videoDisconnect();
    setChannelId(undefined);
  }, [videoDisconnect]);

  const contextState: VideoCommsContextType = {
    channelId,
    localParticipant,
    joinChannel: setChannelId,
    disconnect: disconnectCallback,
    remoteParticipants: participants,
  };

  return (
    <VideoCommsContext.Provider value={contextState}>
      {children}
    </VideoCommsContext.Provider>
  );
};
