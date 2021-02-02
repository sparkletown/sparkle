import React, { useMemo } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { PrivateChatMessage, RestrictedChatMessage } from "store/actions/Chat";
import { WithId } from "utils/id";

import { ChatMessage } from "../ChatMessage";

import "./Chatbox.scss";

export type ChatboxProps = {
  messages: WithId<RestrictedChatMessage>[];
  sendMessage: (message: {}) => void;
  deleteMessage: (message: {}) => void;
};

export const Chatbox: React.FC<ChatboxProps> = ({
  messages,
  sendMessage,
  deleteMessage,
}) => {
  const rendreredMessages = useMemo(
    () =>
      messages.map((message) => (
        <ChatMessage
        // text={message.text}
        // date={message.date}
        // user={usersById[message.from]}
        // onDelete={deleteMessage}
        />
      )),
    [messages]
  );

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages-container">{rendreredMessages}</div>
      <form className="chatbox-input-container">
        <input
          className="chatbox-input"
          placeholder="Type your message..."
        ></input>
        <button className="chatbox-input-button" type="submit">
          <FontAwesomeIcon
            icon={faPaperPlane}
            className={classNames("chatbox-input-button_icon", {
              "chatbox-input-button_icon--active": true,
            })}
            size="lg"
          />
        </button>
      </form>
    </div>
  );
};
