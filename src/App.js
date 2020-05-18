import React, { Fragment, useState } from 'react';

import { useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';

import 'bootstrap';

import Announcements from './Announcements';
import Chatbox from './Chatbox';
import EntranceExperience from './EntranceExperience';
import Header from './Header';
import LockedSite from './LockedSite';
import Map from './Map';
import Rooms from './Rooms';
import RoomModals from './RoomModals';

import { LINEUP } from './lineup';
import { LOCK_SITE_AFTER_UTC_SECONDS } from './config';

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

  function updateProfile(values) {
    user.updateProfile(values).then(() => {
      console.log('setUser', user);
      setUser({...user});
    });
  }

  const now = new Date().getTime() / 1000;
  if (now >= LOCK_SITE_AFTER_UTC_SECONDS) {
    return <LockedSite />
  }

  if (!user) {
    return <EntranceExperience updateProfile={updateProfile} />
  }

  return (
    <Fragment>
      <Header user={user} updateProfile={updateProfile} />
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Map rooms={LINEUP.rooms} />
            <Rooms rooms={LINEUP.rooms} />
          </div>
          <div className="col-md-3 pl-0">
            <Announcements announcements={announcements} />
            <Chatbox chats={chats} user={user} />
          </div>
        </div>
      </div>
      <RoomModals rooms={LINEUP.rooms} />
    </Fragment>
  );
}
