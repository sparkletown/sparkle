import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import classNames from "classnames";
import { isEqual } from "lodash";

import { CHATBOX_NEXT_RENDER_SIZE } from "settings";

import {
  ChatOptionType,
  DeleteMessage,
  MessageToDisplay,
  SendChatReply,
  SendMessage,
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

export interface ChatboxProps extends ContainerClassName {
  messages: WithId<MessageToDisplay>[];
  sendMessage: SendMessage;
  sendThreadReply: SendChatReply;
  deleteMessage?: DeleteMessage;
  displayPoll?: boolean;
}

const _ChatBox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  sendThreadReply,
  deleteMessage,
  displayPoll: isDisplayedPoll,
  containerClassName,
}) => {
  const scrollableComponentRef = useTriggerScrollFix(messages);

  const { createPoll, voteInPoll } = useVenuePoll();

  const [selectedThread, setSelectedThread] = useState<
    WithId<MessageToDisplay>
  >();

  const closeThread = useCallback(() => setSelectedThread(undefined), []);

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

  const getNextMessagesRenderCount = useCallback(
    (currentCount: number) =>
      Math.min(currentCount + CHATBOX_NEXT_RENDER_SIZE, messages.length),
    [messages.length]
  );

  const [renderedMessagesCount, setRenderedMessagesCount] = useState(
    getNextMessagesRenderCount(0)
  );

  const increaseRenderedMessagesCount = useCallback(() => {
    setRenderedMessagesCount(getNextMessagesRenderCount(renderedMessagesCount));
  }, [getNextMessagesRenderCount, renderedMessagesCount]);

  const renderedMessages = useMemo(() => {
    const messagesToRender = messages.slice(0, renderedMessagesCount);
    return messagesToRender.map((message, i) => (
      <ChatboxMessage
        key={message.id}
        message={message}
        nextMessage={messagesToRender?.[i + 1]}
        deleteMessage={deleteMessage}
        voteInPoll={voteInPoll}
        selectThisThread={() => setSelectedThread(message)}
      />
    ));
  }, [messages, renderedMessagesCount, deleteMessage, voteInPoll]);

  const onReplyToThread = useCallback(
    async ({ replyText, threadId }) => {
      await sendThreadReply({ replyText, threadId });
      unselectOption();
      closeThread();
    },
    [unselectOption, closeThread, sendThreadReply]
  );

  return (
    <div className={classNames("Chatbox", containerClassName)}>
      <div
        className="Chatbox__messages"
        ref={scrollableComponentRef}
        id={"Chatbox_scrollable_div"}
      >
        <InfiniteScroll
          dataLength={renderedMessagesCount}
          className={"Chatbox__messages-infinite-scroll"}
          next={increaseRenderedMessagesCount}
          inverse
          hasMore={renderedMessagesCount < messages.length}
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
        {selectedThread && (
          <ChatboxThreadControls
            text="replying to"
            threadAuthor={selectedThread.from.partyName}
            closeThread={closeThread}
          />
        )}
        {isQuestionOptions && !selectedThread && (
          <ChatboxThreadControls
            text="asking a question"
            closeThread={unselectOption}
          />
        )}
        {isDisplayedPoll && !isQuestionOptions && !selectedThread && (
          <ChatboxOptionsControls
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        )}
        {activeOption === ChatOptionType.poll ? (
          <PollBox onPollSubmit={onPollSubmit} />
        ) : (
          <ChatMessageBox
            selectedThread={selectedThread}
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
