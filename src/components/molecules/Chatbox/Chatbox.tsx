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

import "./CampChat.scss";
import "./Chatbox.scss";

interface ChatOutDataType {
  messageToTheBand: string;
}

interface ChatboxProps {
  chats: WithId<PrivateChatMessage | RestrictedChatMessage>[];
  onMessageSubmit: (data: ChatOutDataType) => void;
  allowDelete?: boolean;
  emptyListMessage?: string;
}

const ChatBox: React.FC<ChatboxProps> = ({
  allowDelete,
  chats,
  onMessageSubmit,
  emptyListMessage,
}) => {
  const venueId = useVenueId();
  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);

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
          messages={chats}
          emptyListMessage={emptyListMessage}
          allowDelete={allowDelete}
          deleteMessage={deleteMessage}
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
