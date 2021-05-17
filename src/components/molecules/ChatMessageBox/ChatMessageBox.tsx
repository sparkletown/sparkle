import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { MessageToDisplay, SendChatReply, SendMesssage } from "types/chat";

import { WithId } from "utils/id";

import { InputField } from "components/atoms/InputField";

import "./ChatMessageBox.scss";

export interface ChatMessageBoxProps {
  selectedThread?: WithId<MessageToDisplay>;
  sendMessage: SendMesssage;
  sendThreadReply: SendChatReply;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  selectedThread,
  sendMessage,
  sendThreadReply,
}) => {
  const hasChosenThread = selectedThread !== undefined;
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

  const { register, handleSubmit, watch, reset } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const sendMessageToChat = handleSubmit(({ message }) => {
    setMessageSending(true);
    sendMessage(message);
    reset();
  });

  const sendReplyToThread = handleSubmit(({ message }) => {
    if (!selectedThread) return;

    setMessageSending(true);
    sendThreadReply({ replyText: message, threadId: selectedThread.id });
    reset();
  });

  const chatValue = watch("message");

  return (
    <form
      className="Chatbox__form"
      onSubmit={hasChosenThread ? sendReplyToThread : sendMessageToChat}
    >
      <InputField
        containerClassName="Chatbox__input"
        ref={register({ required: true })}
        name="message"
        placeholder="Write your message..."
        autoComplete="off"
      />
      <button
        className="Chatbox__submit-button"
        type="submit"
        disabled={!chatValue || isSendingMessage}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="Chatbox__submit-button-icon"
          size="lg"
        />
      </button>
    </form>
  );
};
