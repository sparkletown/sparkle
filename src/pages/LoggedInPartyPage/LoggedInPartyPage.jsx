import React from "react";
import Map from "components/molecules/Map";
import UserList from "components/molecules/UserList";
import PartyTitle from "components/molecules/PartyTitle";
import "./LoggedInPartyPage.scss";
import Chatbox from "components/organisms/Chatbox";
import RoomList from "components/organisms/RoomList";
import CountDown from "components/molecules/CountDown";

const LoggedInPartyPage = ({ config, users, attendances }) => (
  <WithNavigationBar>
    <div className="container">
      <div className="small-right-margin">
        <PartyTitle startUtcSeconds={config.start_utc_seconds} />
      </div>
      {users && (
        <div className="col">
          <UserList users={users} imageSize={50} />
        </div>
      )}
      <div className="col">
        <div className="starting-indication">
          This is the clickable party map. Begin at the Dock of the Bay.
        </div>
        <CountDown startUtcSeconds={config.start_utc_seconds} />
      </div>
      <div className="row">
        <Map config={config} attendances={attendances} />
      </div>
      <div className="row">
        <div className="col">
          <RoomList
            startUtcSeconds={config.start_utc_seconds}
            rooms={config.rooms}
            attendances={attendances}
          />
        </div>
        <div className="col-5 chat-wrapper">
          <Chatbox />
        </div>
      </div>
    </div>
  </WithNavigationBar>
);

export default LoggedInPartyPage;
