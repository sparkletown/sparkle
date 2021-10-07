import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";

import { NON_EXISTENT_FIRESTORE_ID } from "settings";

import { PrivateChatMessage } from "types/chat";

import { useVenueChatThreadMessages } from "hooks/chats/venue/useVenueChatThreadMessages";

export interface ChatboxContextState {
  venueId?: string;
  preloadedThreads: Record<string, PrivateChatMessage[]>;
}

export const ChatboxContext = createContext<ChatboxContextState>({
  venueId: undefined,
  preloadedThreads: {},
});

interface ChatboxContextProviderProps {
  venueId?: string;
  preloadedThreads?: Record<string, PrivateChatMessage[]>;
}

export const useChatboxThread = (threadId: string) => {
  const context = useContext(ChatboxContext);
  const preloadedThread = context.preloadedThreads[threadId];
  const liveThread = useVenueChatThreadMessages(
    context.venueId ?? NON_EXISTENT_FIRESTORE_ID,
    threadId
  );

  return useMemo(() => [...preloadedThread, ...liveThread], [
    liveThread,
    preloadedThread,
  ]);
};

export const ChatboxContextProvider: React.FC<
  PropsWithChildren<ChatboxContextProviderProps>
> = ({ children, venueId, preloadedThreads }) => {
  const state: ChatboxContextState = useMemo(
    () => ({
      venueId,
      preloadedThreads: preloadedThreads ?? {},
    }),
    [preloadedThreads, venueId]
  );

  return (
    <ChatboxContext.Provider value={state}>{children}</ChatboxContext.Provider>
  );
};
