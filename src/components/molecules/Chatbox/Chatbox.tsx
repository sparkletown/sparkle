import React, { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import classNames from "classnames";
import { isEqual } from "lodash";

import {
  ChatOptionType,
  InfiniteScrollProps,
  MessageToDisplay,
  SendChatMessage,
  SendThreadMessageProps,
} from "types/chat";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useVenuePoll } from "hooks/useVenuePoll";

import { ChatboxMessage } from "components/molecules/Chatbox/components/ChatboxMessage";
import {
  useChatboxSendThreadMessage,
  useDeselectReplyThread,
  useHasSelectedReplyThread,
} from "components/molecules/Chatbox/components/context/ChatboxContext";
import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { Loading } from "components/molecules/Loading";
import { PollBox } from "components/molecules/PollBox";

import { ChatboxOptionsControls } from "./components/ChatboxOptionsControls";
import { ChatboxThreadControls } from "./components/ChatboxThreadControls";
import { useTriggerScrollFix } from "./useTriggerScrollFix";

import "./Chatbox.scss";

export interface ChatboxProps extends ContainerClassName, InfiniteScrollProps {
  messages: WithId<MessageToDisplay>[];
  displayPollOption?: boolean;
}

const _ChatBox: React.FC<ChatboxProps> = ({
  messages,
  displayPollOption,
  containerClassName,
  hasMore,
  loadMore = () => {},
}) => {
  const scrollableComponentRef = useTriggerScrollFix(messages);

  const { createPoll, voteInPoll } = useVenuePoll();

  const closeThread = useDeselectReplyThread();

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

  const sendThreadMessage = useChatboxSendThreadMessage();

  const sendThreadMessageWrapper: SendChatMessage<SendThreadMessageProps> = useCallback(
    async ({ text, threadId }) => {
      await sendThreadMessage({ text, threadId });
      unselectOption();
      closeThread();
    },
    [unselectOption, closeThread, sendThreadMessage]
  );

  const hasSelectedThread = useHasSelectedReplyThread();

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
          {messages.map((message, i) => (
            <ChatboxMessage
              key={message.id}
              message={message}
              nextMessage={messages?.[i + 1]}
              voteInPoll={voteInPoll}
            />
          ))}
        </InfiniteScroll>
      </div>
      <div className="Chatbox__form-box">
        {/* @debt sort these out. Preferably using some kind of enum */}
        {hasSelectedThread && (
          <ChatboxThreadControls
            text="asking a question"
            closeThread={unselectOption}
          />
        )}
        {isQuestionOptions && !hasSelectedThread && (
          <ChatboxThreadControls
            text="asking a question"
            closeThread={unselectOption}
          />
        )}
        {displayPollOption && !isQuestionOptions && !hasSelectedThread && (
          <ChatboxOptionsControls
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />
        )}
        {activeOption === ChatOptionType.poll ? (
          <PollBox onPollSubmit={onPollSubmit} />
        ) : (
          <ChatMessageBox
            sendThreadMessageWrapper={sendThreadMessageWrapper}
            unselectOption={unselectOption}
            isQuestion={isQuestionOptions}
          />
        )}
      </div>
    </div>
  );
};

export const Chatbox = React.memo(_ChatBox, isEqual);
