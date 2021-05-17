import React, { useMemo, useState, useCallback } from "react";

import {
  DeleteMessage,
  MessageToDisplay,
  SendChatReply,
  SendMesssage,
} from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageBox } from "components/molecules/ChatMessageBox";

import { ChatMessage } from "components/atoms/ChatMessage";

import { ChatboxThreadControls } from "./components/ChatboxThreadControls";

import "./Chatbox.scss";

export interface ChatboxProps {
  messages: WithId<MessageToDisplay>[];
  sendMessage: SendMesssage;
  sendThreadReply: SendChatReply;
  deleteMessage: DeleteMessage;
  displayPoll?: boolean;
}

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  sendThreadReply,
  deleteMessage,
  displayPoll,
}) => {
  console.log(displayPoll);
  const [selectedThread, setSelectedThread] = useState<
    WithId<MessageToDisplay>
  >();

  const closeThread = useCallback(() => setSelectedThread(undefined), []);

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          deleteMessage={deleteMessage}
          selectThisThread={() => setSelectedThread(message)}
        />
      )),
    [messages, deleteMessage]
  );

  return (
    <div className="Chatbox">
      <div className="Chatbox__messages">{renderedMessages}</div>
      <div className="Chatbox__form-box">
        {selectedThread && (
          <ChatboxThreadControls
            threadAuthor={selectedThread.author.partyName}
            closeThread={closeThread}
          />
        )}

        <ChatMessageBox
          selectedThread={selectedThread}
          sendMessage={sendMessage}
          sendThreadReply={sendThreadReply}
        />
      </div>
    </div>
  );
};
