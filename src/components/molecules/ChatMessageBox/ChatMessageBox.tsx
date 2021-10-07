import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { EmojiData } from "emoji-mart";

import { SendChatMessage, SendThreadMessageProps } from "types/chat";

import {
  useChatboxSendChatMessage,
  useSelectedReplyThread,
} from "hooks/chats/private/ChatboxContext";
import { useShowHide } from "hooks/useShowHide";

import { EmojiPicker } from "components/molecules/EmojiPicker";

import { InputField } from "components/atoms/InputField";

import "./ChatMessageBox.scss";

export interface ChatMessageBoxProps {
  sendThreadMessageWrapper: SendChatMessage<SendThreadMessageProps>;
  unselectOption: () => void;
  isQuestion?: boolean;
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  sendThreadMessageWrapper,
  unselectOption,
  isQuestion = false,
}) => {
  const selectedThreadId = useSelectedReplyThread()?.id;
  const hasChosenThread = Boolean(selectedThreadId);

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

  const sendMessage = useChatboxSendChatMessage();

  const [{ loading: isSendingMessage }, sendMessageToChat] = useAsyncFn(
    async ({ message }) => {
      console.log("sendMessage", message);
      reset();
      unselectOption();

      await sendMessage({ text: message, isQuestion });
    },
    [isQuestion, reset, sendMessage, unselectOption]
  );

  const [{ loading: isReplying }, sendReplyToThread] = useAsyncFn(
    async ({ message }) => {
      if (!selectedThreadId) return;
      reset();

      await sendThreadMessageWrapper({
        text: message,
        threadId: selectedThreadId,
      });
    },
    [sendThreadMessageWrapper, reset, selectedThreadId]
  );

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

  const buttonClasses = classNames("Chatbox__submit-button", {
    "Chatbox__submit-button--question": isQuestion,
  });

  return (
    <>
      <form
        className="Chatbox__form"
        onSubmit={handleSubmit(
          hasChosenThread ? sendReplyToThread : sendMessageToChat
        )}
      >
        <InputField
          inputClassName="Chatbox__input"
          ref={register({ required: true })}
          name="message"
          placeholder={`Write your ${placeholderValue}...`}
          autoComplete="off"
        />
        <button
          aria-label="Send message"
          className="Chatbox__submit-button"
          type="button"
          onClick={toggleEmojiPicker}
        >
          <FontAwesomeIcon
            icon={faSmile}
            className="Chatbox__submit-button-icon"
            size="lg"
          />
        </button>
        <button
          aria-label="Send message"
          className={buttonClasses}
          type="submit"
          disabled={!chatValue || isSendingMessage || isReplying}
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
          <EmojiPicker onSelect={addEmoji} />
        </div>
      )}
    </>
  );
};
