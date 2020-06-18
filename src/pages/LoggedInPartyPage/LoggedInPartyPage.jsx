import React from "react";
import Map from "components/molecules/Map";
import UserList from "components/molecules/UserList";
import PartyTitle from "components/molecules/PartyTitle";
import "./LoggedInPartyPage.scss";
import Chatbox from "components/organisms/Chatbox";
import RoomList from "components/organisms/RoomList";
import CountDown from "components/molecules/CountDown";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { PARTY_NAME } from "config";
import { useSelector } from "react-redux";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

const LoggedInPartyPage = () => {
  const { config, partygoers } = useSelector((state) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
    partygoers: state.firestore.ordered.partygoers,
  }));

  useProfileInformationCheck();

  const attendances = partygoers
    ? partygoers.reduce((acc, value) => {
        acc[value.room] = (acc[value.room] || 0) + 1;
        return acc;
      }, {})
    : [];

  return (
    <WithNavigationBar>
      <div className="container">
        <div className="small-right-margin">
          <PartyTitle startUtcSeconds={config.start_utc_seconds} />
        </div>
        {partygoers && (
          <div className="col">
            <UserList users={partygoers} imageSize={50} />
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
};

export default LoggedInPartyPage;
