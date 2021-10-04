import React, { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import classNames from "classnames";
import { isEqual } from "lodash";

import {
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
  displayPoll?: boolean;
}

const _ChatBox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  sendThreadReply,
  deleteMessage,
  displayPoll: isDisplayedPoll,
  containerClassName,
  allMessagesCount,
  loadMore = () => {},
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
          dataLength={messages.length}
          className={"Chatbox__messages-infinite-scroll"}
          next={loadMore}
          inverse
          hasMore={messages.length < allMessagesCount}
          scrollableTarget="Chatbox_scrollable_div"
          loader={
            <Loading containerClassName="Chatbox__messages-infinite-scroll-loading" />
          }
        >
          {messages.map((message, i) => (
            <ChatboxMessage
              key={message.id}
              message={message}
              nextMessage={messages?.[i + 1]}
              deleteMessage={deleteMessage}
              voteInPoll={voteInPoll}
              selectThisThread={() => setSelectedThread(message)}
            />
          ))}
        </InfiniteScroll>
      </div>
      <div className="Chatbox__form-box">
        {/* @debt sort these out. Preferrably using some kind of enum */}
        {selectedThread && (
          <ChatboxThreadControls
            text="replying to"
            threadAuthor={selectedThread.fromUser.partyName}
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
