import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { formatUtcSeconds } from './utils';
import { isChatValid } from './validation';

import ChatForm from './ChatForm';

// Don't pull everything
// REVISIT: only grab most recent N from server
const RECENT_MESSAGE_COUNT = 200;

export default function Chatbox() {
  useFirestoreConnect('chats');
  let { chats } = useSelector(state => ({
    chats: state.firestore.ordered.chats,
  }));

  if (chats === undefined ) {
    return "Loading chat...";
  }

  chats = chats
    .filter(isChatValid)
    .concat()
    .sort((a, b) => b.ts_utc - a.ts_utc)
    .slice(0, RECENT_MESSAGE_COUNT);

  return (
    <div className="card" id="chat">
      <div className="card-header">
        Party Chat
      </div>
      <div className="card-body text-center">
        <ChatForm />
        {chats.length === 0 &&
          "No chat messages yet"
        }
        <ul className="list-group text-left">
          {chats.map(chat =>
            <li className="list-group-item" key={chat.id}>
              <b>{chat.name}</b>: {chat.text}
              <br/>
              <small>{formatUtcSeconds(chat.ts_utc)}</small>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
