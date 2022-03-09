import React from "react";

import {
  DeleteChatMessageProps,
  MessageToDisplay,
  SendChatMessageProps,
  SendThreadMessageProps,
  VenueChatMessage,
} from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { Chatbox } from "components/molecules/Chatbox";
import { ChatboxContextProvider } from "components/molecules/Chatbox/components/context/ChatboxContext";

type Attributes = {
  space: WithId<AnyVenue>;
};

type HocProps = {
  sendChatMessage: (sendMessageProps: SendChatMessageProps) => Promise<void>;
  sendThreadMessage: (
    sendMessageProps: SendThreadMessageProps
  ) => Promise<void>;
  deleteChatMessage: (props: DeleteChatMessageProps) => Promise<void>;
  deleteThreadMessage: (props: DeleteChatMessageProps) => Promise<void>;
  canDeleteMessages?: boolean;
  limit: number;
  increaseLimit: () => void;
  messages: WithId<MessageToDisplay<VenueChatMessage>>[];
  allChatMessagesCount: number;
};
type VenueChatProps = Attributes & HocProps;

export const VenueChat: React.FC<VenueChatProps> = ({
  sendChatMessage,
  sendThreadMessage,
  deleteChatMessage,
  deleteThreadMessage,
  canDeleteMessages,
  limit,
  increaseLimit,
  messages,
  allChatMessagesCount,
  space,
}) => (
  <ChatboxContextProvider
    venueId={space?.id}
    sendChatMessage={sendChatMessage}
    sendThreadMessage={sendThreadMessage}
    deleteChatMessage={canDeleteMessages ? deleteChatMessage : undefined}
    deleteThreadMessage={canDeleteMessages ? deleteThreadMessage : undefined}
  >
    <Chatbox
      displayPollOption
      messages={messages}
      containerClassName="venue-chat"
      hasMore={limit < allChatMessagesCount}
      loadMore={increaseLimit}
    />
  </ChatboxContextProvider>
);
