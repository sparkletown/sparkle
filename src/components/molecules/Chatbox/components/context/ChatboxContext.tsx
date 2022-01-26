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
  BaseChatMessage,
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
  venueId?: string;
  preloadedThreads?: Record<string, WithId<PrivateChatMessage>[]>;
  selectedReplyThread?: WithId<MessageToDisplay>;
  setSelectedReplyThread: Dispatch<
    SetStateAction<WithId<MessageToDisplay> | undefined>
  >;
}

const ChatboxContext = createContext<ChatboxContextState>({
  venueId: undefined,
  preloadedThreads: {},
  sendChatMessage: async () => {},
  sendThreadMessage: async () => {},
  selectedReplyThread: undefined,
  setSelectedReplyThread: noop,
});

type ChatboxContextProviderProps = Omit<
  ChatboxContextState,
  "selectedReplyThread" | "setSelectedReplyThread"
>;

export const ChatboxContextProvider: React.FC<
  PropsWithChildren<ChatboxContextProviderProps>
> = ({ children, ...rest }) => {
  const [selectedReplyThread, setSelectedReplyThread] =
    useState<WithId<MessageToDisplay>>();

  const state: ChatboxContextState = useMemo(
    () => ({
      selectedReplyThread,
      setSelectedReplyThread,
      ...rest,
    }),
    [rest, selectedReplyThread]
  );

  return (
    <ChatboxContext.Provider value={state}>{children}</ChatboxContext.Provider>
  );
};

export const useChatboxThread = (
  threadId: string
): [WithId<BaseChatMessage>[], boolean] => {
  const context = useContext(ChatboxContext);
  const preloadedThread =
    context?.preloadedThreads?.[threadId] ?? ALWAYS_EMPTY_ARRAY;
  const [liveThread, isLiveThreadLoaded] = useVenueChatThreadMessages(
    context?.venueId ?? NON_EXISTENT_FIRESTORE_ID,
    threadId
  );

  return useMemo(
    () => [[...preloadedThread, ...liveThread], isLiveThreadLoaded],
    [isLiveThreadLoaded, liveThread, preloadedThread]
  );
};

export const useChatboxSendChatMessage =
  (): SendChatMessage<SendChatMessageProps> =>
    useContext(ChatboxContext).sendChatMessage;

export const useChatboxSendThreadMessage =
  (): SendChatMessage<SendThreadMessageProps> =>
    useContext(ChatboxContext).sendThreadMessage;

export const useChatboxDeleteChatMessage = ():
  | DeleteChatMessage<DeleteChatMessageProps>
  | undefined => useContext(ChatboxContext).deleteChatMessage;

export const useChatboxDeleteThreadMessage = ():
  | DeleteChatMessage<DeleteThreadMessageProps>
  | undefined => useContext(ChatboxContext).deleteThreadMessage;

export const useSelectThisReplyThread = (thread: WithId<MessageToDisplay>) => {
  const { setSelectedReplyThread } = useContext(ChatboxContext);
  return useCallback(
    () => setSelectedReplyThread(thread),
    [setSelectedReplyThread, thread]
  );
};

export const useClearSelectedReplyThread = () => {
  const { setSelectedReplyThread } = useContext(ChatboxContext);
  return useCallback(
    () => setSelectedReplyThread(undefined),
    [setSelectedReplyThread]
  );
};

export const useSelectedReplyThread = () =>
  useContext(ChatboxContext).selectedReplyThread;

export const useHasSelectedReplyThread = () =>
  Boolean(useContext(ChatboxContext).selectedReplyThread);
