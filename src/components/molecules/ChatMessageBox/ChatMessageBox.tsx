import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "components/attendee/Input";
import { Popover } from "components/attendee/Popover";
import { EmojiData } from "emoji-mart";

import { ChatTypes, SendChatMessage, SendThreadMessageProps } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useShowHide } from "hooks/useShowHide";

import {
  useChatboxSendChatMessage,
  useSelectedReplyThread,
} from "components/molecules/Chatbox/components/context/ChatboxContext";
import { EmojiPicker } from "components/molecules/EmojiPicker";

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
    handleSubmit,
    register,
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
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );

  const onSendClick = useCallback(() => {
    if (isReplying || isSendingMessage) return;

    return hasChosenThread
      ? sendReplyToThread({ message: chatValue })
      : sendMessageToChat({ message: chatValue });
  }, [
    chatValue,
    hasChosenThread,
    isReplying,
    isSendingMessage,
    sendMessageToChat,
    sendReplyToThread,
  ]);

  return (
    <>
      <form
        ref={setReferenceElement}
        className={styles.chatMessageBoxForm}
        onSubmit={handleSubmit(onSendClick)}
      >
        <Input
          register={register}
          name="message"
          rules={{ required: true }}
          placeholder={placeholder}
          variant="chat"
          autoComplete="off"
          label="Send"
          onLabelClick={onSendClick}
          icon={
            <FontAwesomeIcon className={styles.icon} icon={faSmile} size="lg" />
          }
          onIconClick={toggleEmojiPicker}
        />
      </form>

      {isEmojiPickerVisible && (
        <Popover referenceElement={referenceElement} placement="top-start">
          <EmojiPicker onSelect={addEmoji} />
        </Popover>
      )}
    </>
  );
};
