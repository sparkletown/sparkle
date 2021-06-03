import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { CHAT_MESSAGE_TIMEOUT } from "settings";
import { CustomEmoji, Picker } from "emoji-mart";

import { useShowHide } from "hooks/useShowHide";

import { MessageToDisplay, SendChatReply, SendMessage } from "types/chat";

import { WithId } from "utils/id";

import { InputField } from "components/atoms/InputField";

import "emoji-mart/css/emoji-mart.css";
import "./ChatMessageBox.scss";

export interface ChatMessageBoxProps {
  selectedThread?: WithId<MessageToDisplay>;
  sendMessage: SendMessage;
  sendThreadReply: SendChatReply;
  unselectOption: () => void;
  isQuestion?: boolean;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  selectedThread,
  sendMessage,
  sendThreadReply,
  unselectOption,
  isQuestion = false,
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
  } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const sendMessageToChat = handleSubmit(({ message }) => {
    setMessageSending(true);
    sendMessage({ message, isQuestion });
    reset();
    unselectOption();
  });

  const sendReplyToThread = handleSubmit(({ message }) => {
    if (!selectedThread) return;

    setMessageSending(true);
    sendThreadReply({ replyText: message, threadId: selectedThread.id });
    reset();
    unselectOption();
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

  const placeholderValue = isQuestion ? "question" : "message";

  const buttonClasses = classNames("Chatbox__submit-button", {
    "Chatbox__submit-button--question": isQuestion,
  });

  return (
    <>
      <form
        className="Chatbox__form"
        onSubmit={hasChosenThread ? sendReplyToThread : sendMessageToChat}
      >
        <InputField
          containerClassName="Chatbox__input"
          ref={register({ required: true })}
          name="message"
          placeholder={`Write your ${placeholderValue}...`}
          autoComplete="off"
        />
        <span
          className="Chatbox__emoji-picker-toggler"
          onClick={toggleEmojiPicker}
        >
          😃
        </span>
        <button
          className={buttonClasses}
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

      {isEmojiPickerVisible && (
        <div className="Chatbox__emoji-picker">
          <Picker theme={"dark"} onSelect={addEmoji} />
        </div>
      )}
    </>
  );
};
