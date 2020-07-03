import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import Chatbox from "components/organisms/Chatbox";
import Room from "components/organisms/Room";
import TablesUserList from "components/molecules/TablesUserList";
import "./FriendShipPage.scss";
import { FRIENDSHIP_CUSTOM_TABLES } from "./constants";
import TableComponent from "components/molecules/TableComponent";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import TableHeader from "components/molecules/TableHeader";
import { useSelector } from "react-redux";

const FriendShipPage: React.FunctionComponent = () => {
  const [seatedAtTable, setSeatedAtTable] = useState("");
  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
  }));

  useConnectPartyGoers();

  return (
    <div className="full-page-container">
      <WithNavigationBar>
        <div className="friendship-container">
          <div className="title">
            <h1>{venue.title}</h1>
            <h3>{venue.subtitle}</h3>
          </div>
          <div className="content">
            {!seatedAtTable && (
              <div className="row">
                <div className="col bar-container">
                  <div className="title">{venue.defaultTableTitle}</div>
                  <div className="subtitle">{venue.defaultTableSubtitle}</div>
                  <div className="wrapper">
                    <Room roomName="friendship" setUserList={() => null} />
                  </div>
                </div>
                <div className="col-4">
                  <Chatbox room="friendship" />
                </div>
              </div>
            )}
          </div>
          <div className="row">
            <div
              className={`col ${
                seatedAtTable ? "table-container" : "table-grid"
              }`}
            >
              <TablesUserList
                venueName={venue.name}
                setSeatedAtTable={setSeatedAtTable}
                seatedAtTable={seatedAtTable}
                TableComponent={TableComponent}
                customTables={FRIENDSHIP_CUSTOM_TABLES}
                leaveText="Return to Isle of Friends"
                joinMessage={true}
              />
              {seatedAtTable && (
                <div className="col wrapper">
                  <TableHeader
                    seatedAtTable={seatedAtTable}
                    setSeatedAtTable={setSeatedAtTable}
                    venueName={venue.name}
                  />
                  <Room roomName={seatedAtTable} setUserList={() => null} />
                </div>
              )}
            </div>
          </div>
          {seatedAtTable && (
            <div className="centered-row">
              <div className="col-6">
                <Chatbox room="friendship" />
              </div>
            </div>
          )}
        </div>
      </WithNavigationBar>
    </div>
  );
};

export default FriendShipPage;
