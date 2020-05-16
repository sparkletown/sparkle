import React, { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import firebase from 'firebase';

// One message per second
const TIME_BETWEEN_SENDS_MILLIS = 2000;

export default function ChatForm(props) {
  const firestore = useFirestore();

  const [text, setText] = useState('');
  const [longEnoughSinceLastSend, setLongEnoughSinceLastSend] = useState(true);

  const textChanged = (e) => {
    setText(e.target.value);
  }

  const chatSubmitted = (e) => {
    e.preventDefault();
    firestore
      .collection('chats')
      .add({
        ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
        name: props.user.displayName,
        text: text,
    });
    setText('');
    setLongEnoughSinceLastSend(false);
    window.setTimeout(() => {
      setLongEnoughSinceLastSend(true);
    }, TIME_BETWEEN_SENDS_MILLIS);
  }

  const allowSend = () => {
    return longEnoughSinceLastSend && text.length > 0;
  }
  
  if (props.user.displayName && props.user.displayName.length) {
    return (
      <form onSubmit={chatSubmitted}>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Message" value={text} onChange={textChanged} />
          <button className="btn btn-success" type="small" disabled={!allowSend()}>
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