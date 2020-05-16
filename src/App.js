import React, { Fragment } from 'react';

import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import 'bootstrap';

import Header from './Header';
import Map from './Map';
import Rooms from './Rooms';
import Announcements from './Announcements';
import Chatbox from './Chatbox';

import { LINEUP } from './lineup';

export default function App() {
  useFirestoreConnect(['chats', 'announcements']);
  const { chats, announcements } = useSelector(state => ({
    chats: state.firestore.ordered.chats,
    announcements: state.firestore.ordered.announcements,
  }));

  return (
    <Fragment>
      <Header name="abc" />
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Map rooms={LINEUP.rooms} />
            <Rooms rooms={LINEUP.rooms} />
          </div>
          <div className="col-md-3 pl-0">
            <Announcements announcements={announcements} />
            <Chatbox chats={chats} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
