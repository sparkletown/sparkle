import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";

import { ALWAYS_EMPTY_ARRAY, NON_EXISTENT_FIRESTORE_ID } from "settings";

import {
  ChatActions,
  DeleteChatMessage,
  DeleteChatMessageProps,
  DeleteThreadMessageProps,
  PrivateChatMessage,
  SendChatMessage,
  SendChatMessageProps,
  SendThreadMessageProps,
} from "types/chat";

import { useVenueChatThreadMessages } from "hooks/chats/venue/useVenueChatThreadMessages";

export interface ChatboxContextState extends ChatActions {
  venueId?: string;
  preloadedThreads?: Record<string, PrivateChatMessage[]>;
}

export const ChatboxContext = createContext<ChatboxContextState>({
  venueId: undefined,
  sendChatMessage: async () => {},
  sendThreadMessage: async () => {},
  preloadedThreads: {},
});

export const useChatboxThread = (threadId: string) => {
  const context = useContext(ChatboxContext);
  const preloadedThread =
    context?.preloadedThreads?.[threadId] ?? ALWAYS_EMPTY_ARRAY;
  const liveThread = useVenueChatThreadMessages(
    context.venueId ?? NON_EXISTENT_FIRESTORE_ID,
    threadId
  );

  return useMemo(() => [...preloadedThread, ...liveThread], [
    liveThread,
    preloadedThread,
  ]);
};

export const useChatboxSendChatMessage = (): SendChatMessage<SendChatMessageProps> =>
  useContext(ChatboxContext).sendChatMessage;

export const useChatboxSendThreadMessage = (): SendChatMessage<SendThreadMessageProps> =>
  useContext(ChatboxContext).sendThreadMessage;

export const useChatboxDeleteChatMessage = ():
  | DeleteChatMessage<DeleteChatMessageProps>
  | undefined => useContext(ChatboxContext).deleteChatMessage;

export const useChatboxDeleteThreadMessage = ():
  | DeleteChatMessage<DeleteThreadMessageProps>
  | undefined => useContext(ChatboxContext).deleteThreadMessage;

export const ChatboxContextProvider: React.FC<
  PropsWithChildren<ChatboxContextState>
> = ({ children, ...rest }) => {
  return (
    <ChatboxContext.Provider value={rest}>{children}</ChatboxContext.Provider>
  );
};
