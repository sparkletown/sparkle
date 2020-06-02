import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import firebase from "firebase/app";

import { sendChat } from "./actions";

// Prevent spamming the chatbox
const TIME_BETWEEN_SENDS_MILLIS = 2000;

export default function ChatForm() {
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  const [text, setText] = useState("");
  const [longEnoughSinceLastSend, setLongEnoughSinceLastSend] = useState(true);

  if (!user) {
    return null;
  }

  function textChanged(e) {
    setText(e.target.value);
  }

  function chatSubmitted(e) {
    e.preventDefault();
    dispatch(sendChat(user.displayName, text));
    setText("");
    setLongEnoughSinceLastSend(false);
    window.setTimeout(() => {
      setLongEnoughSinceLastSend(true);
    }, TIME_BETWEEN_SENDS_MILLIS);
  }

  function allowSend() {
    return longEnoughSinceLastSend && text.length > 0;
  }

  if (user.displayName && user.displayName.length) {
    return (
      <form onSubmit={chatSubmitted}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Message"
            value={text}
            onChange={textChanged}
          />
          <button
            className="btn btn-success"
            type="small"
            disabled={!allowSend()}
          >
            Send
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      Cannot chat while incognito - tap on top right to change your name.
    </div>
  );
}
