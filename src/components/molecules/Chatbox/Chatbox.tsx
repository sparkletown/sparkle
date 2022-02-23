import React, { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { isEqual } from "lodash";

import {
  InfiniteScrollProps,
  MessageToDisplay,
  SendChatMessage,
  SendThreadMessageProps,
} from "types/chat";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { ChatboxMessage } from "components/molecules/Chatbox/components/ChatboxMessage";
import {
  useChatboxSendThreadMessage,
  useClearSelectedReplyThread,
  useHasSelectedReplyThread,
} from "components/molecules/Chatbox/components/context/ChatboxContext";
import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { Loading } from "components/molecules/Loading";

import { ChatboxThreadControls } from "./components/ChatboxThreadControls";
import { useTriggerScrollFix } from "./useTriggerScrollFix";

import styles from "./Chatbox.module.scss";

export interface ChatboxProps extends ContainerClassName, InfiniteScrollProps {
  messages: WithId<MessageToDisplay>[];
  displayPollOption?: boolean;
}

const _ChatBox: React.FC<ChatboxProps> = ({ messages, hasMore, loadMore }) => {
  const scrollableComponentRef = useTriggerScrollFix(messages);

  const closeThread = useClearSelectedReplyThread();

  const sendThreadMessage = useChatboxSendThreadMessage();

  const sendThreadMessageWrapper: SendChatMessage<SendThreadMessageProps> = useCallback(
    async ({ text, threadId }) => {
      await sendThreadMessage({ text, threadId });
      closeThread();
    },
    [closeThread, sendThreadMessage]
  );

  const hasSelectedThread = useHasSelectedReplyThread();

  return (
    <div className={styles.chatboxContainer}>
      <div
        className={styles.chatboxMessages}
        ref={scrollableComponentRef}
        id={"Chatbox_scrollable_div"}
      >
        <InfiniteScroll
          className={styles.messageScroller}
          dataLength={messages.length}
          next={loadMore}
          inverse
          hasMore={hasMore}
          scrollableTarget="Chatbox_scrollable_div"
          loader={<Loading />}
        >
          {messages.map((message, i) => (
            <ChatboxMessage
              key={message.id}
              message={message}
              nextMessage={messages?.[i + 1]}
            />
          ))}
        </InfiniteScroll>
      </div>
      <div>
        {hasSelectedThread && (
          <ChatboxThreadControls text="Replying to" closeThread={closeThread} />
        )}
        <ChatMessageBox
          sendThreadMessageWrapper={sendThreadMessageWrapper}
          unselectOption={closeThread}
        />
      </div>
    </div>
  );
};

export const Chatbox = React.memo(_ChatBox, isEqual);
