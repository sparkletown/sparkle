import React from 'react';
import { formatUtcSeconds } from './utils';
import { isChatValid } from './validation';

export default function Chatbox(props) {
  if (props.chats === undefined ) {
    return "Loading chat...";
  }

  const chats = props.chats
    .filter(isChatValid)
    .concat()
    .sort((a, b) => b.ts_utc - a.ts_utc);

  return (
    <div className="card" id="chat">
      <div className="card-header">
        Chat Box
      </div>
      <div className="card-body text-center">
        {chats.length === 0 &&
          "No chat messages yet"
        }
        <form>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Message" />
            <button className="btn btn-outline-success" type="small">
              Send
            </button>
          </div>
        </form>
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
