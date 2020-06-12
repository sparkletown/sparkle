import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  sendGlobalChat,
  sendPrivateChat,
  sendRoomChat,
  sendTableChat,
} from "actions";
import { User } from "../UserProfileModal/UserProfileModal";

// Prevent spamming the chatbox
const TIME_BETWEEN_SENDS_MILLIS = 2000;

interface PropsType {
  currentUserUID?: string;
  discussionPartner?: User;
  type: string;
  room?: string;
  table?: string;
}

const ChatForm: React.FunctionComponent<PropsType> = ({
  currentUserUID,
  discussionPartner,
  room,
  type,
  table,
}) => {
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [longEnoughSinceLastSend, setLongEnoughSinceLastSend] = useState(true);

  function textChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  const sendMessage = (
    type: string,
    currentUserUID: string | undefined,
    discussionPartner: User | undefined,
    text: string
  ) => {
    switch (type) {
      case "private":
        return dispatch(
          sendPrivateChat(currentUserUID, discussionPartner?.id, text)
        );
      case "global":
        return dispatch(sendGlobalChat(currentUserUID, text));
      case "room":
        return dispatch(sendRoomChat(currentUserUID, room, text));
      case "table":
        return dispatch(sendTableChat(currentUserUID, table, text));
      default:
        return;
    }
  };

  function chatSubmitted(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.ChangeEvent<HTMLElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    e.preventDefault();
    if (text.length > 0) {
      sendMessage(type, currentUserUID, discussionPartner, text);
      setText("");
      setLongEnoughSinceLastSend(false);
      window.setTimeout(() => {
        setLongEnoughSinceLastSend(true);
      }, TIME_BETWEEN_SENDS_MILLIS);
    }
  }

  function allowSend() {
    return longEnoughSinceLastSend && text.length > 0;
  }

  return (
    <form onSubmit={chatSubmitted}>
      <div className="chat-form">
        <input
          type="text"
          className="chat-input"
          placeholder="Message"
          value={text}
          onChange={textChanged}
        />
        <button
          className="chat-submit-button"
          onClick={chatSubmitted}
          disabled={!allowSend()}
        >
          <img
            src="/sparkle-icon.png"
            className="submit-icon"
            alt="sparkle icon"
            width="20"
          />
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
