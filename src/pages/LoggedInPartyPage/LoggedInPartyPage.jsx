import React from "react";
import Map from "components/molecules/Map";
import UserList from "components/molecules/UserList";
import NavBar from "components/molecules/NavBar";
import PartyTitle from "components/molecules/PartyTitle";
import "./LoggedInPartyPage.scss";
import Chatbox from "components/organisms/Chatbox";
import RoomList from "components/organisms/RoomList";

const LoggedInPartyPage = ({ config, users, attendances }) => (
  <>
    <NavBar />
    <div className="container">
      <div className="row">
        <div className="col small-right-margin">
          <PartyTitle />
          <Map config={config} attendances={attendances} />
          <RoomList rooms={config.rooms} attendances={attendances} />
        </div>
        <div className="col-3">
          <div className="row">{users && <UserList users={users} />}</div>
          <div className="row">
            <Chatbox />
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LoggedInPartyPage;
