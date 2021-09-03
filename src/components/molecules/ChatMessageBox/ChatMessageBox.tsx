import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { EmojiData } from "emoji-mart";

import { CHAT_MESSAGE_TIMEOUT } from "settings";

import { MessageToDisplay, SendChatReplyProps, SendMessage } from "types/chat";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { EmojiPicker } from "components/molecules/EmojiPicker";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./ChatMessageBox.scss";

export interface ChatMessageBoxProps {
  selectedThread?: WithId<MessageToDisplay>;
  sendMessage: SendMessage;
  unselectOption: () => void;
  isQuestion?: boolean;
  onReplyToThread: (data: SendChatReplyProps) => void;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  selectedThread,
  sendMessage,
  unselectOption,
  onReplyToThread,
  isQuestion = false,
}) => {
  const hasChosenThread = selectedThread !== undefined;
  const [isSendingMessage, setMessageSending] = useState(false);

  // @debt replace with useDebounce
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
    onReplyToThread({ replyText: message, threadId: selectedThread.id });
    reset();
  });

  const {
    isShown: isEmojiPickerVisible,
    hide: hideEmojiPicker,
    toggle: toggleEmojiPicker,
  } = useShowHide();

  const addEmoji = useCallback(
    (emoji: EmojiData) => {
      if ("native" in emoji && emoji.native) {
        const message = getValues("message");
        setValue("message", message + emoji.native);
      }

      hideEmojiPicker();
    },
    [getValues, hideEmojiPicker, setValue]
  );

  const chatValue = watch("message");

  const placeholderValue = isQuestion ? "question" : "message";

  const buttonClasses = classNames({
    "Chatbox__submit-button": true,
    "Chatbox__submit-button--question": isQuestion,
  });

  return (
    <>
      <form
        className="Chatbox__form"
        onSubmit={hasChosenThread ? sendReplyToThread : sendMessageToChat}
      >
        <div className="Chatbox__inputs">
          <InputField
            containerClassName="Chatbox__input-container"
            inputClassName="Chatbox__input"
            ref={register({ required: true })}
            name="message"
            placeholder={`Write your ${placeholderValue}...`}
            autoComplete="off"
          />
          <ButtonNG
            aria-label="Send message"
            className="Chatbox__emoji-button"
            onClick={toggleEmojiPicker}
            iconOnly={true}
            iconName={faSmile}
            iconSize="1x"
          />
        </div>
        <div className="Chatbox__buttons">
          <ButtonNG
            aria-label="Send message"
            className={buttonClasses}
            type="submit"
            disabled={!chatValue || isSendingMessage}
            variant="primary"
            iconOnly={true}
            iconName={faPaperPlane}
            iconSize="1x"
          />
        </div>
      </form>

      {isEmojiPickerVisible && (
        <div className="Chatbox__emoji-picker">
          <EmojiPicker onSelect={addEmoji} />
        </div>
      )}
    </>
  );
};
