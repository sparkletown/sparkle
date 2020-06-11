import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { sendChat, sendPrivateChat } from "../../../actions";
import { User } from "../UserProfileModal/UserProfileModal";

// Prevent spamming the chatbox
const TIME_BETWEEN_SENDS_MILLIS = 2000;

interface PropsType {
  currentUser: User;
  currentUserUID?: string;
  discussionPartner?: User;
}

const ChatForm: React.FunctionComponent<PropsType> = ({
  currentUser,
  currentUserUID,
  discussionPartner,
}) => {
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [longEnoughSinceLastSend, setLongEnoughSinceLastSend] = useState(true);

  function textChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function chatSubmitted(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.ChangeEvent<HTMLElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    e.preventDefault();
    if (text.length > 0) {
      discussionPartner
        ? dispatch(
            sendPrivateChat(
              currentUser.partyName,
              currentUserUID,
              discussionPartner.id,
              text
            )
          )
        : dispatch(sendChat(currentUser.partyName, currentUserUID, text));
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
