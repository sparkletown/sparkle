import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

import { WithId } from "utils/id";

import { useVenueId } from "hooks/useVenueId";

import {
  PrivateChatMessage,
  RestrictedChatMessage,
} from "components/context/ChatContext";
import ChatList from "../ChatList";

import "./Chatbox.scss";
import { chatUsersSelector, venueChatUsersSelector } from "utils/selectors";
import { useSelector } from "hooks/useSelector";

interface ChatOutDataType {
  messageToTheBand: string;
}

interface ChatboxProps {
  chats: WithId<PrivateChatMessage | RestrictedChatMessage>[];
  onMessageSubmit: (data: ChatOutDataType) => void;
  allowDelete?: boolean;
  emptyListMessage?: string;
  showSenderImage?: boolean;
  isVenueChat?: boolean;
}

// @debt TODO: we have a ChatBox in organisms but also in molecules.. are they the same? Can we de-dupe them?
const ChatBox: React.FC<ChatboxProps> = ({
  allowDelete,
  chats,
  onMessageSubmit,
  emptyListMessage,
  showSenderImage,
  isVenueChat,
}) => {
  const venueId = useVenueId();
  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);

  const usersByIdSelector = isVenueChat
    ? venueChatUsersSelector
    : chatUsersSelector;

  const usersById = useSelector(usersByIdSelector) ?? {};

  useEffect(() => {
    if (isMessageToTheBarSent) {
      setTimeout(() => {
        setIsMessageToTheBarSent(false);
      }, 2000);
    }
  }, [isMessageToTheBarSent]);

  const { register, handleSubmit, reset } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const submitChatMessage = useCallback(
    async (data: ChatOutDataType) => {
      setIsMessageToTheBarSent(true);
      onMessageSubmit(data);
      reset();
    },
    [onMessageSubmit, reset]
  );

  const deleteMessage = useCallback(
    async (id: string) => {
      await firebase
        .firestore()
        .doc(`venues/${venueId}/chats/${id}`)
        .update({ deleted: true });
    },
    [venueId]
  );

  return (
    <div className="chat-container show">
      {chats && (
        <ChatList
          usersById={usersById}
          messages={chats}
          emptyListMessage={emptyListMessage}
          allowDelete={allowDelete}
          deleteMessage={deleteMessage}
          showSenderImage={showSenderImage}
        />
      )}
      <form className="chat-form" onSubmit={handleSubmit(submitChatMessage)}>
        <div className="chat-input-container">
          <input
            ref={register({ required: true })}
            className="chat-input-message"
            type="text"
            name="messageToTheBand"
            placeholder="Type your message..."
          />
          <input className="chat-input-submit" name="" value="" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
