import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import {
  DeleteMessage,
  MessageToDisplay,
  SendChatReply,
  SendMesssage,
} from "types/chat";

import { WithId } from "utils/id";

import { ChatMessage } from "components/atoms/ChatMessage";
import { InputField } from "components/atoms/InputField";

import { ChatboxThreadControls } from "./components/ChatboxThreadControls";

import "./Chatbox.scss";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  sendMessage: SendMesssage;
  sendThreadReply: SendChatReply;
  deleteMessage: DeleteMessage;
}

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  sendThreadReply,
  deleteMessage,
}) => {
  const [isSendingMessage, setMessageSending] = useState(false);

  const [chosenThread, setChosenThread] = useState<WithId<MessageToDisplay>>();

  const closeThread = useCallback(() => setChosenThread(undefined), []);

  const hasChosenThread = chosenThread !== undefined;

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

  const sendMessageToChat = handleSubmit(({ message }) => {
    setMessageSending(true);
    sendMessage(message);
    reset();
  });

  const sendReplyToThread = handleSubmit(({ message }) => {
    if (!chosenThread) return;

    setMessageSending(true);
    sendThreadReply({ replyText: message, threadId: chosenThread.id });
    reset();
  });

  const chatValue = watch("message");

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          deleteMessage={deleteMessage}
          setChosenThread={() => setChosenThread(message.id)}
        />
      )),
    [messages, deleteMessage]
  );

  return (
    <div className="Chatbox">
      <div className="Chatbox__messages">{renderedMessages}</div>
      <div className="Chatbox__form-box">
        {chosenThread && (
          <ChatboxThreadControls
            threadAuthor={chosenThread.author.partyName}
            onThreadLeave={quitThread}
          />
        )}

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
      </div>
    </div>
  );
};
