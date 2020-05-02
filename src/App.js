import React from 'react';
import Map from './Map';
import Rooms from './Rooms';
import Announcements from './Announcements';

export default function App() {
  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col">
          <Map />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <Rooms />
        </div>
        <div className="col-md-6">
          <Announcements />
        </div>
      </div>
    </div>
  );
}
