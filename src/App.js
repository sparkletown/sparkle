import React from 'react';

import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import Map from './Map';
import Rooms from './Rooms';
import Announcements from './Announcements';

export default function App() {
  useFirestoreConnect(['rooms', 'announcements']);
  const { rooms, announcements } = useSelector(state => ({
    rooms: state.firestore.ordered.rooms,
    announcements: state.firestore.ordered.announcements,
  }));

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col">
          <Map rooms={rooms} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <Announcements announcements={announcements} />
        </div>
        <div className="col-md-6">
          <Rooms rooms={rooms} />
        </div>
      </div>
    </div>
  );
}
