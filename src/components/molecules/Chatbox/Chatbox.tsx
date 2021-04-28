import React, { useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPoll,
  faQuestion,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessage } from "components/atoms/ChatMessage";
// import { ChatPoll } from "components/atoms/ChatPoll";
import ChatMessageBox from "../ChatMessageBox";
import PollBox from "../PollBox";

import "./Chatbox.scss";

type Option = {
  icon: IconDefinition;
  name: string;
};

export const OPTIONS: Option[] = [
  {
    icon: faPoll,
    name: "Create Poll",
  },
  {
    icon: faQuestion,
    name: "Ask question",
  },
];

// const pollData = {
//   votes: 8,
//   poll: {
//     topic: 'test topic',
//     questions: [{ name: 'test1' }, { name: 'test2' }, { name: 'test3' }]
//   },
//   ts_utc: 1619444131,
//   isMine: true,
//   author: {
//     pictureUrl: "/avatars/default-profile-pic-1.png",
//     partyName: "test",
//   },
//   canBeDeleted: true
// }

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
  const [activeOption, setActiveOption] = useState<Option | null>(null);

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage
          key={`${message.ts_utc}-${message.from}`}
          message={message}
          deleteMessage={() => deleteMessage(message.id)}
        />
      )),
    [messages, deleteMessage]
  );

  const dropdownOptions = useMemo(
    () =>
      OPTIONS.map((option) => (
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

  const showPoll = useMemo(() => activeOption?.name !== OPTIONS[0].name, [
    activeOption,
  ]);

  const handleSubmit = useCallback((data) => console.log(data), []);

  const renderForms = useMemo(() => {
    switch (activeOption?.name) {
      case OPTIONS[0].name:
        return <PollBox onSubmit={handleSubmit} />;

      default:
        return <ChatMessageBox sendMessage={sendMessage} />;
    }
  }, [activeOption, sendMessage, handleSubmit]);

  return (
    <div className="chatbox">
      <div className="chatbox__messages">
        {
          renderedMessages
          // <ChatPoll
          //   pollData={pollData}
          //   deletePoll={console.log}
          // />
        }
      </div>
      <div className="chatbox__container">
        {showPoll ? (
          <DropdownButton
            id="options-dropdown"
            title="Options"
            className="chatbox__dropdown"
            variant="link"
            drop="up"
          >
            {dropdownOptions}
          </DropdownButton>
        ) : (
          <div
            className="chatbox__cancel-poll"
            onClick={() => setActiveOption(null)}
          >
            Cancel Poll
          </div>
        )}
        {renderForms}
      </div>
    </div>
  );
};
