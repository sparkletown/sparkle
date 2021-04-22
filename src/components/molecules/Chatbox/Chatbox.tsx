import React, { useMemo, useState } from "react";
import { MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessage } from "components/atoms/ChatMessage";
import ChatMessageBox from "../ChatMessageBox";
import PollBox from "../PollBox";

import "./Chatbox.scss";

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
  const [isOpenPoll, setOpenPoll] = useState(false);

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

  return (
    <div className="chatbox">
      <div className="chatbox__messages">{renderedMessages}</div>
      <div className="chatbox__container">
        <div onClick={() => setOpenPoll(!isOpenPoll)}>
          {!isOpenPoll ? "create poll" : "cancel poll"}
        </div>
        {!isOpenPoll && <ChatMessageBox sendMessage={sendMessage} />}
        {isOpenPoll && <PollBox />}
      </div>
    </div>
  );
};
