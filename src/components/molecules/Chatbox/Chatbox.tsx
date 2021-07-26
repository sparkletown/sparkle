import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isEqual } from "lodash";

import {
  ChatOptionType,
  DeleteMessage,
  MessageToDisplay,
  SendChatReply,
  SendMessage,
} from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { checkIfPollMessage } from "utils/chat";

import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { ChatPoll } from "components/molecules/ChatPoll";
import { PollBox } from "components/molecules/PollBox";
import { ChatMessage } from "components/atoms/ChatMessage";

import { useVenuePoll } from "hooks/useVenuePoll";

import { ChatboxThreadControls } from "./components/ChatboxThreadControls";
import { ChatboxOptionsControls } from "./components/ChatboxOptionsControls";

import "./Chatbox.scss";
import InfiniteScroll from "react-infinite-scroll-component";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  loadMoreMessages: () => void;
  hasMoreMessages: boolean;
  venue: WithId<AnyVenue>;
  sendMessage: SendMessage;
  sendThreadReply: SendChatReply;
  deleteMessage: DeleteMessage;
  displayPoll?: boolean;
}

const _ChatBox: React.FC<ChatboxProps> = ({
  messages,
  loadMoreMessages,
  hasMoreMessages,
  venue,
  sendMessage,
  sendThreadReply,
  deleteMessage,
  displayPoll: isDisplayedPoll,
}) => {
  console.assert(messages.length > 0);

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

  // @debt createPoll should be returning Promise; make sense to use useAsync here
  const onPollSubmit = useCallback(
    (data) => {
      createPoll(data);
      unselectOption();
    },
    [createPoll, unselectOption]
  );

  const isQuestionOptions = ChatOptionType.question === activeOption;

  let renderedMessages: JSX.Element[];
  renderedMessages = useMemo(
    () =>
      messages.map((message) =>
        checkIfPollMessage(message) ? (
          <ChatPoll
            key={message.id}
            pollMessage={message}
            deletePollMessage={deleteMessage}
            voteInPoll={voteInPoll}
            venue={venue}
          />
        ) : (
          <ChatMessage
            key={message.id}
            message={message}
            deleteMessage={deleteMessage}
            selectThisThread={() => setSelectedThread(message)}
          />
        )
      ),
    [messages, deleteMessage, voteInPoll, venue]
  );

  const onReplyToThread = useCallback(
    ({ replyText, threadId }) => {
      sendThreadReply({ replyText, threadId });
      unselectOption();
      closeThread();
    },
    [unselectOption, closeThread, sendThreadReply]
  );

  return (
    <div className="Chatbox">
      <div
        className="Chatbox__messages-container"
        ref={scrollableComponentRef}
        id={"Chatbox_scrollable_div"}
      >
        <InfiniteScroll
          dataLength={messages.length}
          className={"Chatbox__messages-infinite-scroll"}
          next={loadMoreMessages}
          inverse={true}
          hasMore={hasMoreMessages}
          scrollableTarget="Chatbox_scrollable_div"
          loader={<h4>Loading...</h4>}
        >
          {renderedMessages}
        </InfiniteScroll>
      </div>
      <div className="Chatbox__form-box">
        {/* @debt sort these out. Preferrably using some kind of enum */}
        {selectedThread && (
          <ChatboxThreadControls
            text="replying to"
            threadAuthor={selectedThread.author.partyName}
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

/**
 * Workaround for a bug in 'react-infinite-scroll-component' when
 * 'next' function is not beight called when height of initially loaded items is less than container's height.
 * https://github.com/ankeetmaini/react-infinite-scroll-component/issues/217
 *
 * This one triggers additional 'scroll' event for the scrollable div which contains InfiniteScroll component.
 * This triggers internal InfiniteScroll logic to recalculate it's height on initial render too.
 */
export function useTriggerScrollFix(messages: WithId<MessageToDisplay>[]) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.dispatchEvent(new CustomEvent("scroll"));
  }, [messages.length, ref]);

  return ref;
}

export const Chatbox = React.memo(_ChatBox, isEqual);
