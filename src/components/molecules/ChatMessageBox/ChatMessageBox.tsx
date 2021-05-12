import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { InputField } from "components/atoms/InputField";

import "./ChatMessageBox.scss";

export interface ChatMessageBoxProps {
  sendMessage: (text: string) => void;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  sendMessage,
}) => {
  const [isSendingMessage, setMessageSending] = useState(false);

  // This logic disallows users to spam into the chat. There should be a delay, between each message
  useEffect(() => {
    if (!isSendingMessage) return;

    const timeoutId = setTimeout(() => {
      setMessageSending(false);
    }, CHAT_MESSAGE_TIMEOUT);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSendingMessage]);

  const { control, handleSubmit, reset, watch } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const onChatFormSubmit = handleSubmit(({ message }) => {
    setMessageSending(true);
    sendMessage(message);
    reset();
  });

  const chatValue = watch("message");

  return (
    <form className="ChatMessageBox" onSubmit={onChatFormSubmit}>
      <Controller
        as={
          <InputField
            containerClassName="ChatMessageBox__input"
            placeholder="Write your message..."
            autoComplete="off"
          />
        }
        control={control}
        name="message"
      />
      <button
        className="ChatMessageBox__submit-button"
        type="submit"
        disabled={!chatValue || isSendingMessage}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="ChatMessageBox__submit-button-icon"
          size="lg"
        />
      </button>
    </form>
  );
};
