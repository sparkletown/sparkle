import React, { useState } from "react";

import "./Jazz.scss";
import TablesUserList from "components/molecules/TablesUserList";
import { useSelector } from "react-redux";
import { PARTY_NAME } from "config";
import TableComponent from "components/molecules/TableComponent";
import UserList from "components/molecules/UserList";
import Room from "components/organisms/Room";
import { User } from "types/User";
import { JAZZBAR_TABLES } from "./constants";

interface PropsType {
  selectedTab: string;
  setUserList: (value: User[]) => void;
}

const Jazz: React.FunctionComponent<PropsType> = ({
  selectedTab,
  setUserList,
}) => {
  const { experience, users } = useSelector((state: any) => ({
    experience: state.firestore.data.config?.[PARTY_NAME]?.experiences.jazzbar,
    users: state.firestore.ordered.partygoers,
  }));
  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const [seatedAtTable, setSeatedAtTable] = useState("");

  const usersSeated =
    users &&
    users.filter(
      (user: User) =>
        user.data?.[experience.associatedRoom] &&
        user.data[experience.associatedRoom].table
    );

  const usersStanding =
    usersSeated &&
    users.filter(
      (user: User) =>
        user.lastSeenIn === experience.associatedRoom &&
        !usersSeated.includes(user)
    );

  return (
    <div className="scrollable-area">
      <div
        className={`content ${
          !seatedAtTable ? "jazz-bar-grid" : "jazz-bar-table"
        }`}
      >
        {experience && (
          <TablesUserList
            setSeatedAtTable={setSeatedAtTable}
            seatedAtTable={seatedAtTable}
            experienceName={experience.associatedRoom}
            TableComponent={TableComponent}
            joinMessage={false}
            customTables={JAZZBAR_TABLES}
          />
        )}
        <div
          className={`jazz-container ${
            !seatedAtTable
              ? "container-in-grid"
              : `container-in-row ${
                  isVideoFocused ? "video-focused col-11" : "col-5"
                }`
          }`}
        >
          <iframe
            title="main event"
            width="100%"
            height="100%"
            className={"youtube-video"}
            src="https://www.youtube.com/embed/b44P11vLiY8?autoplay=1"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
          />
        </div>
        {seatedAtTable && (
          <div
            className={`${isVideoFocused ? "col-5" : "col-12"} table-container`}
          >
            <div className="jazz-wrapper">
              <Room roomName={seatedAtTable} setUserList={setUserList} />
            </div>
            <div>
              <div className="full-screen-checkbox">
                <div className="focus">
                  Focus on:<div className="focus-option">Jazz</div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!isVideoFocused}
                    onChange={() => setIsVideoFocused(!isVideoFocused)}
                  />
                  <span className="slider" />
                </label>
                <div className="focus-option">Friends</div>
              </div>
              {/* <TablesUserList
                setSeatedAtTable={setSeatedAtTable}
                seatedAtTable={seatedAtTable}
                experienceName={experience.associatedRoom}
                TableComponent={TableComponent}
                joinMessage={false}
                customTables={JAZZBAR_TABLES}
              /> */}
            </div>
          </div>
        )}
      </div>

      <div className="user-interaction-container">
        {users && (
          <UserList users={usersStanding} limit={26} activity="standing" />
        )}
      </div>
    </div>
  );
};

export default Jazz;
