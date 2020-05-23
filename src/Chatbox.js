import React from 'react';

import { formatUtcSeconds } from './utils';
import { isChatValid } from './validation';

import ChatForm from './ChatForm';

// Don't pull everything
// REVISIT: only grab most recent N from server
const RECENT_MESSAGE_COUNT = 200;

export default function Chatbox(props) {

  if (props.chats === undefined ) {
    return "Loading chat...";
  }

  const chats = props.chats
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
        <ChatForm user={props.user} />
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
