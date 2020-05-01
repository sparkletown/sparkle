import React from 'react';
import Map from './Map';
import Rooms from './Rooms';
import Announcements from './Announcements';

export default function App() {
  return (
    <div className="container">
      <h2>The Bodyssey: Your Map to the Party</h2>
      <p>This is a clickable map to help you navigate the party.</p>
      <p>Remember at all times, the party is real. Act accordingly.</p>
      <div className="row mb-3">
        <div className="col">
          <Map />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>Announcements</h2>
          <Announcements />
        </div>
        <div className="col-md-6">
          <h2>Rooms & Lineup</h2>
          <Rooms />
        </div>
      </div>
    </div>
  );
}
