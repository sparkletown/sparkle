import React, { useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoll, faQuestion } from "@fortawesome/free-solid-svg-icons";

import {
  MessageToDisplay,
  ChatOption,
  ChatOptionMap,
  isPollMessage,
  PollQuestion,
  PollValues,
} from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageBox } from "components/molecules/ChatMessageBox";
import { ChatPoll } from "components/molecules/ChatPoll";
import { PollBox } from "components/molecules/PollBox";

import { ChatMessage } from "components/atoms/ChatMessage";

import "./Chatbox.scss";

const pollData = {
  votes: 8,
  pollId: "123",
  poll: {
    topic: "test topic",
    questions: [{ name: "test1" }, { name: "test2" }, { name: "test3" }],
  },
  ts_utc: 1619444131,
  isMine: true,
  author: {
    mirrorVideo: false,
    kidsMode: false,
    anonMode: false,
    enteredVenueIds: [
      "devaliashacksville",
      "devaliasauditorium",
      "jonsfunkyaudiotorium",
      "devaliasjazzbar",
    ],
    pictureUrl: "/avatars/default-profile-pic-1.png",
    lastSeenIn: {
      undefined: 1619201762890,
    },
    partyName: "jimbojr",
    lastSeenAt: 1619201762915,
    data: {},
    id: "oYMle5T6L3UjRbcN54CNBAU054l1",
  },
  canBeDeleted: true,
};

const ChatMessageOption: ChatOptionMap = {
  poll: {
    icon: faPoll,
    name: "Create Poll",
  },
  question: {
    icon: faQuestion,
    name: "Ask Question",
  },
};

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  sendMessage: (text: string) => void;
  deleteMessage: (messageId: string) => void;
}

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  deleteMessage,
}) => {
  // todo: create hook and store for Poll
  // todo: add Poll type for data
  // const { sendPoll, deletePoll, voteInPoll } = useVenuePoll();

  const sendPoll = useCallback((data: PollValues) => console.log(data), []);
  const deletePoll = useCallback((pollId: string) => console.log(pollId), []);
  const voteInPoll = useCallback(
    (question: PollQuestion) => console.log(question),
    []
  );

  const [activeOption, setActiveOption] = useState<ChatOption>();
  const showPoll = activeOption === ChatMessageOption.poll;

  const dropdownOptions = useMemo(
    () =>
      Object.values(ChatMessageOption).map((option) => (
        <Dropdown.Item
          key={option.name}
          onClick={() => setActiveOption(option)}
        >
          {option.name}
          <FontAwesomeIcon icon={option.icon} />
        </Dropdown.Item>
      )),
    []
  );

  const renderedMessages = useMemo(
    () =>
      messages.map((message) =>
        isPollMessage(message) ? (
          <ChatPoll
            pollData={pollData}
            voteInPoll={voteInPoll}
            deletePoll={deletePoll}
          />
        ) : (
          <ChatMessage
            key={`${message.ts_utc}-${message.from}`}
            message={message}
            deleteMessage={() => deleteMessage(message.id)}
          />
        )
      ),
    [messages, deleteMessage, voteInPoll, deletePoll]
  );

  const renderForms = useMemo(() => {
    switch (activeOption) {
      case ChatMessageOption.poll:
        return <PollBox sendPoll={sendPoll} />;

      default:
        return <ChatMessageBox sendMessage={sendMessage} />;
    }
  }, [activeOption, sendMessage, sendPoll]);

  return (
    <div className="chatbox">
      <div className="chatbox__messages">{renderedMessages}</div>
      <div className="chatbox__container">
        {showPoll ? (
          <div
            className="chatbox__cancel-poll"
            onClick={() => setActiveOption(undefined)}
          >
            Cancel Poll
          </div>
        ) : (
          <DropdownButton
            id="options-dropdown"
            title="Options"
            className="chatbox__dropdown"
            variant="link"
            drop="up"
          >
            {dropdownOptions}
          </DropdownButton>
        )}
        {renderForms}
      </div>
    </div>
  );
};
