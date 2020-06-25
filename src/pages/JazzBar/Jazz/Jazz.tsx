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
      <div className={`content ${!seatedAtTable ? "jazz-bar-grid" : "row"}`}>
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
        {seatedAtTable && (
          <div className="col table-container">
            <div className="jazz-wrapper">
              <Room roomName={seatedAtTable} setUserList={setUserList} />
            </div>
          </div>
        )}
        <div className="col jazz-container">
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
