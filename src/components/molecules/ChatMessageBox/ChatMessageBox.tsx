import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmojiData } from "emoji-mart";

import { ChatTypes, SendChatMessage, SendThreadMessageProps } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useShowHide } from "hooks/useShowHide";

import {
  useChatboxSendChatMessage,
  useSelectedReplyThread,
} from "components/molecules/Chatbox/components/context/ChatboxContext";
import { EmojiPicker } from "components/molecules/EmojiPicker";

import { InputField } from "components/atoms/InputField";

import styles from "./ChatMessageBox.module.scss";

const determineChatPlaceholder = (
  isPrivate: boolean,
  isQuestion: boolean,
  recipient?: string
) => {
  if (isQuestion) {
    return "Type your question";
  }
  if (isPrivate) {
    return `Message ${recipient}`;
  }

  return "Type your message";
};

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

  const { chatSettings } = useChatSidebarControls();

  const [{ loading: isSendingMessage }, sendMessageToChat] = useAsyncFn(
    async ({ message }) => {
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

  const placeholder = determineChatPlaceholder(
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT,
    isQuestion,
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
      ? chatSettings.recipient?.partyName
      : undefined
  );

  return (
    <>
      <form
        className={styles.chatMessageBoxForm}
        onSubmit={handleSubmit(
          hasChosenThread ? sendReplyToThread : sendMessageToChat
        )}
      >
        <InputField
          register={register}
          name="message"
          rules={{ required: true }}
          placeholder={placeholder}
          autoComplete="off"
          iconEnd={
            <FontAwesomeIcon
              className={styles.emojiPickerIcon}
              icon={faSmile}
              size="lg"
            />
          }
          iconEndClassName={styles.inputIconEnd}
          onIconEndClick={toggleEmojiPicker}
        />
        <div className={styles.separator} />
        <button
          aria-label="Send message"
          type="submit"
          disabled={!chatValue || isSendingMessage || isReplying}
        >
          Send
        </button>
      </form>

      {isEmojiPickerVisible && (
        <div>
          <EmojiPicker onSelect={addEmoji} />
        </div>
      )}
    </>
  );
};
