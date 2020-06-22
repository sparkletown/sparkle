import React, { useState } from "react";
import { useSelector } from "react-redux";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import Chatbox from "components/organisms/Chatbox";
import Room from "components/organisms/Room";
import TablesUserList from "components/molecules/TablesUserList";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import "./FriendShipPage.scss";
import { FRIENDSHIP_CUSTOM_TABLES } from "./constants";
import FriendShipTableComponent from "components/molecules/FriendShipTableComponent";
import { PARTY_NAME } from "config";

const FriendShipPage = () => {
  const [seatedAtTable, setSeatedAtTable] = useState("");
  const { user, experience } = useSelector((state: any) => ({
    user: state.user,
    experience:
      state.firestore.data.config?.[PARTY_NAME]?.experiences.friendship,
  }));
  useUpdateLocationEffect(user, experience.associatedRoom);

  return (
    <div className="full-page-container">
      <WithNavigationBar>
        <div className="friendship-container">
          <div className="title">
            <h1>Welcome to Isle of Friends!</h1>
            <h3>
              Chat in the entrance room, or scroll down to the spaces below to
              make new connections
            </h3>
          </div>
          <div className="content">
            {!seatedAtTable && (
              <div className="row">
                <div className="col bar-container">
                  <div className="title">Welcome reception</div>
                  <div className="subtitle">
                    Sip on Prosecco as you greet your fellow festival goers
                  </div>
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
            <div className={`col ${seatedAtTable ? "table-container" : ""}`}>
              {experience && (
                <TablesUserList
                  experienceName={experience.associatedRoom}
                  setSeatedAtTable={setSeatedAtTable}
                  seatedAtTable={seatedAtTable}
                  TableComponent={FriendShipTableComponent}
                  customTables={FRIENDSHIP_CUSTOM_TABLES}
                />
              )}
              {seatedAtTable && (
                <>
                  <div className="col wrapper">
                    <Room roomName={seatedAtTable} setUserList={() => null} />
                  </div>
                </>
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
