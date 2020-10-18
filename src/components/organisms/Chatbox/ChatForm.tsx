import React, { useContext, useState } from "react";

import { User } from "types/User";
import { ChatContext } from "components/context/ChatContext";
import { WithId } from "utils/id";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Prevent spamming the chatbox
const TIME_BETWEEN_SENDS_MILLIS = 2000;

interface PropsType {
  currentUserUID?: string;
  discussionPartner?: WithId<User>;
  type: string;
  room?: string;
  table?: string;
  setIsRecipientChangeBlocked: (value: boolean) => void;
}

const ChatForm: React.FunctionComponent<PropsType> = ({
  currentUserUID,
  discussionPartner,
  room,
  type,
  table,
  setIsRecipientChangeBlocked,
}) => {
  const [text, setText] = useState("");
  const [longEnoughSinceLastSend, setLongEnoughSinceLastSend] = useState(true);

  function textChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  const chatContext = useContext(ChatContext);

  if (!chatContext) return <></>;

  const {
    sendPrivateChat,
    sendGlobalChat,
    sendRoomChat,
    sendTableChat,
  } = chatContext;

  const sendMessage = (
    type: string,
    currentUserUID: string | undefined,
    discussionPartner: WithId<User> | undefined,
    text: string
  ) => {
    if (!currentUserUID) return;
    switch (type) {
      case "private":
        return (
          discussionPartner &&
          sendPrivateChat(currentUserUID, discussionPartner.id, text)
        );
      case "global":
        return sendGlobalChat(currentUserUID, text);
      case "room":
        return room && sendRoomChat(currentUserUID, room, text);
      case "table":
        return table && sendTableChat(currentUserUID, table, text);
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
      setIsRecipientChangeBlocked(false);
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
          onFocus={() => setIsRecipientChangeBlocked(true)}
        />
        <button
          className="chat-submit-button"
          onClick={chatSubmitted}
          id="chatbox-send-message"
          disabled={!allowSend()}
        >
          <FontAwesomeIcon className="submit-icon" icon={faArrowRight} />
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
