import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import "./ChatMessageBox.scss";

export interface ChatMessageBoxProps {
  sendMessage: (text: string) => void;
}

const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({ sendMessage }) => {
  const [isSendingMessage, setMessageSending] = useState(false);

  // This logic dissallows users to spam into the chat. There should be a delay, between each message
  useEffect(() => {
    if (isSendingMessage) {
      setTimeout(() => {
        setMessageSending(false);
      }, 500);
    }
  }, [isSendingMessage]);

  const { register, handleSubmit, reset, watch } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(({ message }) => {
    setMessageSending(true);
    sendMessage(message);
    reset();
  });

  const chatValue = watch("message");

  return (
    <form className="chatbox__form" onSubmit={onSubmit}>
      <input
        className="chatbox__input"
        ref={register({ required: true })}
        name="message"
        placeholder="Write your message..."
        autoComplete="off"
      />
      <button
        className="chatbox__submit-button"
        type="submit"
        disabled={!chatValue || isSendingMessage}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="chatbox__submit-button-icon"
          size="lg"
        />
      </button>
    </form>
  );
};

export default ChatMessageBox;
