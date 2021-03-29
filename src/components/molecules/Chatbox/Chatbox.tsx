import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessage } from "components/atoms/ChatMessage";

import "./Chatbox.scss";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  sendMessage: (text: string) => void;
  deleteMessage: (messageId: string) => void;
}

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  deleteMessage,
}) => {
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

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage
          key={`${message.ts_utc}-${message.from}`}
          message={message}
          deleteMessage={() => deleteMessage(message.id)}
        />
      )),
    [messages, deleteMessage]
  );

  const [isEventScheduleVisible, setEventScheduleVisible] = useState(false);
  const toggleEventSchedule = useCallback(() => {
    setEventScheduleVisible(!isEventScheduleVisible);
  }, [isEventScheduleVisible]);

  return (
    <div className="chatbox">
      <div className="chatbox__messages">{renderedMessages}</div>

      <form className="chatbox__form" onSubmit={onSubmit}>
        <div
          className={`nav-chat-logo ${isEventScheduleVisible && "clicked"}`}
          onClick={toggleEventSchedule}
        >
          Schedule
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <input
            className="chatbox__input"
            ref={register({ required: true })}
            name="message"
            placeholder="Write your message..."
            autoComplete="off"
          ></input>
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
        </div>
      </form>
    </div>
  );
};
