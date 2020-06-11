import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { sendChat } from "../../../actions";

// Prevent spamming the chatbox
const TIME_BETWEEN_SENDS_MILLIS = 2000;

export default function ChatForm({ currentUser, currentUserUID }) {
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [longEnoughSinceLastSend, setLongEnoughSinceLastSend] = useState(true);

  function textChanged(e) {
    setText(e.target.value);
  }

  function chatSubmitted(e) {
    e.preventDefault();
    if (text.length > 0) {
      dispatch(sendChat(currentUser.partyName, currentUserUID, text));
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
        <div
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
        </div>
      </div>
    </form>
  );
}
