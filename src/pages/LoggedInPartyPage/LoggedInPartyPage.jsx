import React from "react";
import Map from "components/molecules/Map";
import UserList from "components/molecules/UserList";
import NavBar from "components/molecules/NavBar";
import PartyTitle from "components/molecules/PartyTitle";
import "./LoggedInPartyPage.scss";
import { LINEUP } from "lineup";

const LoggedInPartyPage = ({ users, attendances }) => (
  <>
    <NavBar />
    <div className="container">
      <div className="row">
        <div className="col small-right-margin">
          <PartyTitle />
          <Map rooms={LINEUP.rooms} attendances={attendances} />
        </div>
        <div className="col-3">{users && <UserList users={users} />}</div>
      </div>
    </div>
  </>
);

export default LoggedInPartyPage;
