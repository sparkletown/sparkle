import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { noop } from "lodash";

import { ALWAYS_EMPTY_ARRAY, NON_EXISTENT_FIRESTORE_ID } from "settings";

import {
  ChatActions,
  DeleteChatMessage,
  DeleteChatMessageProps,
  DeleteThreadMessageProps,
  MessageToDisplay,
  PrivateChatMessage,
  SendChatMessage,
  SendChatMessageProps,
  SendThreadMessageProps,
} from "types/chat";

import { WithId } from "utils/id";

import { useVenueChatThreadMessages } from "hooks/chats/venue/useVenueChatThreadMessages";

export interface ChatboxContextState extends ChatActions {
  venueId: string;
  preloadedThreads: Record<string, PrivateChatMessage[]>;
  selectedReplyThread?: WithId<MessageToDisplay>;
  setSelectedReplyThread: Dispatch<
    SetStateAction<WithId<MessageToDisplay> | undefined>
  >;
}

const ChatboxContext = createContext<ChatboxContextState>({
  venueId: NON_EXISTENT_FIRESTORE_ID,
  preloadedThreads: {},
  sendChatMessage: async () => {},
  sendThreadMessage: async () => {},
  selectedReplyThread: undefined,
  setSelectedReplyThread: noop,
});

export const useChatboxThread = (threadId: string) => {
  const context = useContext(ChatboxContext);
  const preloadedThread =
    context.preloadedThreads[threadId] ?? ALWAYS_EMPTY_ARRAY;
  const liveThread = useVenueChatThreadMessages(context.venueId, threadId);

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

export const useSelectReplyThread = (thread: WithId<MessageToDisplay>) => {
  const { setSelectedReplyThread } = useContext(ChatboxContext);
  return useCallback(() => setSelectedReplyThread(thread), [
    setSelectedReplyThread,
    thread,
  ]);
};

export const useDeselectReplyThread = () => {
  const { setSelectedReplyThread } = useContext(ChatboxContext);
  return useCallback(() => setSelectedReplyThread(undefined), [
    setSelectedReplyThread,
  ]);
};

export const useSelectedReplyThread = () =>
  useContext(ChatboxContext).selectedReplyThread;

type Props = ChatActions & {
  venueId?: string;
  preloadedThreads?: Record<string, PrivateChatMessage[]>;
};

export const ChatboxContextProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  venueId = NON_EXISTENT_FIRESTORE_ID,
  preloadedThreads = {},
  ...rest
}) => {
  const [selectedReplyThread, setSelectedReplyThread] = useState<
    WithId<MessageToDisplay>
  >();

  const state: ChatboxContextState = useMemo(
    () => ({
      venueId,
      preloadedThreads,
      selectedReplyThread,
      setSelectedReplyThread,
      ...rest,
    }),
    [preloadedThreads, rest, selectedReplyThread, venueId]
  );

  return (
    <ChatboxContext.Provider value={state}>{children}</ChatboxContext.Provider>
  );
};
