import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";
import { OnAvatarClick } from "types/User";

import { WithId } from "utils/id";

import { ChatMessage } from "components/atoms/ChatMessage";

import "./Chatbox.scss";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  sendMessage: (text: string) => void;
  deleteMessage: (messageId: string) => void;
  onAvatarClick: OnAvatarClick;
}

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  onAvatarClick,
  deleteMessage,
}) => {
  const [isSendingMessage, setMessageSending] = useState(false);

  useEffect(() => {
    if (isSendingMessage) {
      setTimeout(() => {
        setMessageSending(false);
      }, 500);
    }
  }, [isSendingMessage]);

  const { register, handleSubmit, reset } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(({ message }) => {
    setMessageSending(true);
    sendMessage(message);
    reset();
  });

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage
          key={`${message.ts_utc}-${message.from}`}
          message={message}
          deleteMessage={() => deleteMessage(message.id)}
          onAuthorClick={() => onAvatarClick(message.author)}
        />
      )),
    [messages, onAvatarClick, deleteMessage]
  );

  return (
    <div className="chatbox">
      <div className="chatbox__messages">{renderedMessages}</div>
      <form className="chatbox__form" onSubmit={onSubmit}>
        <input
          className="chatbox__input"
          ref={register({ required: true })}
          name="message"
          placeholder="Write your message..."
        ></input>
        <button
          className="chatbox__submit-button"
          type="submit"
          disabled={isSendingMessage}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="chatbox__submit-button-icon"
            size="lg"
          />
        </button>
      </form>
    </div>
  );
};
