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

const FriendShipPage = () => {
  const [seatedAtTable, setSeatedAtTable] = useState("");
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));
  useUpdateLocationEffect(user, "Friend Ship");

  return (
    <WithNavigationBar>
      <div className="friendship-container">
        <div className="container">
          <div className="title row">
            <h1>Welcome to the friendship room!</h1>
            <h3>Pick one of our spaces to start making friends!</h3>
          </div>
          <div className="row">
            <div className="col content">
              <div className="row">
                {seatedAtTable ? (
                  <>
                    <div className="col wrapper">
                      <Room roomName={seatedAtTable} setUserList={() => null} />
                    </div>
                  </>
                ) : (
                  <div className="col bar-container">
                    <div className="wrapper">
                      <Room roomName="friendship" setUserList={() => null} />
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col table-container">
                  <TablesUserList
                    experienceName="friendship"
                    setSeatedAtTable={setSeatedAtTable}
                    seatedAtTable={seatedAtTable}
                    TableComponent={FriendShipTableComponent}
                    customTables={FRIENDSHIP_CUSTOM_TABLES}
                  />
                </div>
              </div>
            </div>
            <div className="col-5">
              <Chatbox room="friendship" />
            </div>
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default FriendShipPage;
