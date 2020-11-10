import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { MessageList } from "./MessageList";
import { useForm } from "react-hook-form";
import "./CampChat.scss";
import { useVenueId } from "hooks/useVenueId";
import "./Chatbox.scss";
import {
  PrivateChatMessage,
  RestrictedChatMessage,
} from "components/context/ChatContext";
import { WithId } from "utils/id";

interface ChatOutDataType {
  messageToTheBand: string;
}

interface PropsType {
  chats: WithId<PrivateChatMessage | RestrictedChatMessage>[];
  onMessageSubmit: (data: ChatOutDataType) => void;
  allowDelete?: boolean;
  emptyListMessage?: string;
}

const ChatBox: React.FC<PropsType> = ({
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

  const onBarMessageSubmit = async (data: ChatOutDataType) => {
    setIsMessageToTheBarSent(true);
    onMessageSubmit(data);
    reset();
  };

  const deleteMessage = async (id: string) => {
    await firebase
      .firestore()
      .doc(`venues/${venueId}/chats/${id}`)
      .update({ deleted: true });
  };

  return (
    <div className="chat-container show">
      {chats && (
        <MessageList
          messages={chats}
          emptyListMessage={emptyListMessage}
          allowDelete={allowDelete}
          deleteMessage={deleteMessage}
        />
      )}
      <form className="chat-form" onSubmit={handleSubmit(onBarMessageSubmit)}>
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
