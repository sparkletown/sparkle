import React, { Fragment, useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';

import 'bootstrap';
import qs from 'qs';

import Announcements from './Announcements';
import Chatbox from './Chatbox';
import EntranceExperience from './EntranceExperience';
import Header from './Header';
import LockedSite from './LockedSite';
import Map from './Map';
import Rooms from './Rooms';

import { LINEUP } from './lineup';
import { LOCK_SITE_AFTER_UTC_SECONDS, PARTY_START_UTC_SECONDS } from './config';

export default function App(props) {
  const firebase = useFirebase();
  const [user, setUser] = useState();
  const [time, setTime] = useState(Date.now() / 1000);

  // REVISIT: this causes the map to re-render every second
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now() / 1000), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);


  function killLoginsFromBeforePartyStart(user) {
    if (user) {
      const partyHasStarted = time >= PARTY_START_UTC_SECONDS;
      const lastSignInTimeSeconds = new Date(user.metadata.lastSignInTime) / 1000;
      const signedInBeforePartyStart = lastSignInTimeSeconds < PARTY_START_UTC_SECONDS;

      if (partyHasStarted && signedInBeforePartyStart) {
        firebase.auth().signOut();
      }
    }
  }

  firebase.auth().onAuthStateChanged(user => {
    setUser(user);
    killLoginsFromBeforePartyStart(user);
  });

  useFirestoreConnect(['chats', 'announcements', 'users']);
  const { chats, announcements, users } = useSelector(state => ({
    chats: state.firestore.ordered.chats,
    announcements: state.firestore.ordered.announcements,
    users: state.firestore.ordered.users,
  }));

  // Remove room presence etc. on disconnect
  window.onbeforeunload = () => {
    if (user) {
      firebase.firestore()
        .doc(`users/${user.uid}`)
        .update({
          room: null
      });
    }
  }

  // REVISIT: Can we put this on the server
  const attendances = users ? users.reduce((acc, value) => (acc[value.room] = (acc[value.room] || 0) + 1, acc), {}) : [];
  console.log('attendances', attendances);

  function updateProfile(values) {
    user.updateProfile(values).then(() => {
      setUser({...user});
    });
  }

  const search = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const unlock = search.unlock !== undefined;

  if (!unlock && time >= LOCK_SITE_AFTER_UTC_SECONDS) {
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
            <Map rooms={LINEUP.rooms} user={user} attendances={attendances} />
          </div>
          <div className="col-md-3 pl-0">
            <Announcements announcements={announcements} />
            <Chatbox chats={chats} user={user} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
