import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import classNames from "classnames";
import { isEqual } from "lodash";

import {
  BaseChatMessage,
  ChatActions,
  ChatOptionType,
  InfiniteScrollProps,
  MessageToDisplay,
} from "types/chat";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useVenuePoll } from "hooks/useVenuePoll";

import { ChatboxMessage } from "components/molecules/Chatbox/components/ChatboxMessage";
import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { Loading } from "components/molecules/Loading";
import { PollBox } from "components/molecules/PollBox";

import { ChatboxOptionsControls } from "./components/ChatboxOptionsControls";
import { ChatboxThreadControls } from "./components/ChatboxThreadControls";
import { useTriggerScrollFix } from "./useTriggerScrollFix";

import "./Chatbox.scss";

export interface ChatboxProps
  extends ContainerClassName,
    ChatActions,
    InfiniteScrollProps {
  messages: WithId<MessageToDisplay>[];
  threadMessages: WithId<BaseChatMessage>[];
  displayPoll?: boolean;
  selectedThread?: WithId<MessageToDisplay>;
  setSelectedThread: (thread?: WithId<MessageToDisplay>) => void;
}

const _ChatBox: React.FC<ChatboxProps> = ({
  messages,
  threadMessages,
  sendMessage,
  sendThreadReply,
  deleteMessage,
  deleteThreadReply,
  displayPoll: isDisplayedPoll,
  containerClassName,
  selectedThread,
  setSelectedThread,
  hasMore,
  loadMore = () => {},
}) => {
  const scrollableComponentRef = useTriggerScrollFix(messages);

  const { createPoll, voteInPoll } = useVenuePoll();

  const closeThread = useCallback(() => setSelectedThread(undefined), [
    setSelectedThread,
  ]);

  const [activeOption, setActiveOption] = useState<ChatOptionType>();

  const unselectOption = useCallback(() => {
    setActiveOption(undefined);
  }, []);

  const onPollSubmit = useCallback(
    async (data) => {
      await createPoll(data);
      unselectOption();
    },
    [createPoll, unselectOption]
  );

  const isQuestionOptions = ChatOptionType.question === activeOption;

  const onReplyToThread = useCallback(
    async ({ replyText, threadId }) => {
      await sendThreadReply({ replyText, threadId });
      unselectOption();
      closeThread();
    },
    [unselectOption, closeThread, sendThreadReply]
  );

  const hasSelectedThread = threadMessages?.length > 0;

  const renderedMessages = useMemo(
    () =>
      messages.map((message, i) => (
        <ChatboxMessage
          key={message.id}
          message={message}
          thread={threadMessages}
          nextMessage={messages?.[i + 1]}
          deleteMessage={deleteMessage}
          deleteThreadReply={deleteThreadReply}
          voteInPoll={voteInPoll}
          selectThisThread={() => setSelectedThread(message)}
        />
      )),
    [
      deleteMessage,
      deleteThreadReply,
      messages,
      setSelectedThread,
      threadMessages,
      voteInPoll,
    ]
  );

  return (
    <div className={classNames("Chatbox", containerClassName)}>
      <div
        className="Chatbox__messages"
        ref={scrollableComponentRef}
        id={"Chatbox_scrollable_div"}
      >
        <InfiniteScroll
          dataLength={messages.length}
          className={"Chatbox__messages-infinite-scroll"}
          next={loadMore}
          inverse
          hasMore={hasMore}
          scrollableTarget="Chatbox_scrollable_div"
          loader={
            <Loading containerClassName="Chatbox__messages-infinite-scroll-loading" />
          }
        >
          {renderedMessages}
        </InfiniteScroll>
      </div>
      <div className="Chatbox__form-box">
        {/* @debt sort these out. Preferrably using some kind of enum */}
        {!!selectedThread && (
          <ChatboxThreadControls
            text="replying to"
            threadAuthor={selectedThread.fromUser.partyName}
            closeThread={closeThread}
          />
        )}
        {isQuestionOptions && !hasSelectedThread && (
          <ChatboxThreadControls
            text="asking a question"
            closeThread={unselectOption}
          />
        )}
        {isDisplayedPoll && !isQuestionOptions && !hasSelectedThread && (
          <ChatboxOptionsControls
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        )}
        {activeOption === ChatOptionType.poll ? (
          <PollBox onPollSubmit={onPollSubmit} />
        ) : (
          <ChatMessageBox
            selectedThreadId={selectedThread?.id}
            sendMessage={sendMessage}
            unselectOption={unselectOption}
            isQuestion={isQuestionOptions}
            onReplyToThread={onReplyToThread}
          />
        )}
      </div>
    </div>
  );
};

export const Chatbox = React.memo(_ChatBox, isEqual);
