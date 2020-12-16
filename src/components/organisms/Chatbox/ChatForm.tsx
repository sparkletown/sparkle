import React, { useState } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "hooks/useDispatch";
import { useVenueId } from "hooks/useVenueId";
import {
  sendGlobalChat,
  sendPrivateChat,
  sendRoomChat,
  sendTableChat,
} from "store/actions/Chat";

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
  const venueId = useVenueId();
  const [text, setText] = useState("");
  const [longEnoughSinceLastSend, setLongEnoughSinceLastSend] = useState(true);

  function textChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  const dispatch = useDispatch();

  const sendMessage = (
    type: string,
    currentUserUID: string | undefined,
    discussionPartner: WithId<User> | undefined,
    text: string
  ) => {
    if (!currentUserUID) return;
    switch (type) {
      case "private":
        if (!discussionPartner) return;

        return dispatch(
          sendPrivateChat({
            from: currentUserUID,
            to: discussionPartner.id,
            text,
          })
        );
      case "global":
        if (!venueId) return;
        return dispatch(
          sendGlobalChat({
            venueId,
            from: currentUserUID,
            text,
          })
        );
      case "room":
        if (!room || !venueId) return;
        return dispatch(
          sendRoomChat({
            venueId,
            from: currentUserUID,
            to: room,
            text,
          })
        );
      case "table":
        if (!table || !venueId) return;
        return dispatch(
          sendTableChat({
            venueId,
            from: currentUserUID,
            to: table,
            text,
          })
        );
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
