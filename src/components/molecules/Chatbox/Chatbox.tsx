import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { CustomEmoji, Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

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

  const [selectedThread, setSelectedThread] = useState<
    WithId<MessageToDisplay>
  >();

  const closeThread = useCallback(() => setSelectedThread(undefined), []);

  const hasChosenThread = selectedThread !== undefined;

  // This logic dissallows users to spam into the chat. There should be a delay, between each message
  useEffect(() => {
    if (isSendingMessage) {
      setTimeout(() => {
        setMessageSending(false);
      }, 500);
    }
  }, [isSendingMessage]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<{
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

  const {
    isShown: isEmojiPickerVisible,
    hide: hideEmojiPicker,
    toggle: toggleEmojiPicker,
  } = useShowHide();

  const addEmoji = (emoji: CustomEmoji) => {
    if (emoji.colons) {
      const message = getValues("message");
      setValue("message", message + emoji.colons);
    }
    
    hideEmojiPicker();
  };

  const chatValue = watch("message");

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          deleteMessage={deleteMessage}
          selectThisThread={() => setSelectedThread(message)}
        />
      )),
    [messages, deleteMessage]
  );

  return (
    <div className="Chatbox">
      <div className="Chatbox__messages">{renderedMessages}</div>
      <div className="Chatbox__form-box">
        {selectedThread && (
          <ChatboxThreadControls
            threadAuthor={selectedThread.author.partyName}
            closeThread={closeThread}
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
          <span
            className="Chatbox__emoji-picker-toggler"
            onClick={toggleEmojiPicker}
          >
            😃
          </span>
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
      {isEmojiPickerVisible && (
        <div className="Chatbox__emoji-picker">
          <Picker onSelect={addEmoji} />
        </div>
      )}
    </div>
  );
};
