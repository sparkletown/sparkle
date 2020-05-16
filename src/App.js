import React, { Fragment, useState } from 'react';

import { useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';

import 'bootstrap';

import Header from './Header';
import EntranceExperience from './EntranceExperience';
import Map from './Map';
import Rooms from './Rooms';
import Announcements from './Announcements';
import Chatbox from './Chatbox';
import RoomModals from './RoomModals';

import { LINEUP } from './lineup';

export default function App() {
  const firebase = useFirebase();
  const [user, setUser] = useState();
  firebase.auth().onAuthStateChanged(user => {
    setUser(user);
  });

  useFirestoreConnect(['chats', 'announcements', 'users']);
  const { chats, announcements } = useSelector(state => ({
    chats: state.firestore.ordered.chats,
    announcements: state.firestore.ordered.announcements,
  }));

  if (!user) {
    return <EntranceExperience />
  }

  return (
    <Fragment>
      <Header user={user} />
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
      <RoomModals rooms={LINEUP.rooms} />
    </Fragment>
  );
}
