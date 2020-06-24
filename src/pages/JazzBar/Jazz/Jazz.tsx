import React, { useState } from "react";

import "./Jazz.scss";
import TablesUserList from "components/molecules/TablesUserList";
import { useSelector } from "react-redux";
import { PARTY_NAME } from "config";
import FriendShipTableComponent from "components/molecules/FriendShipTableComponent";
import UserList from "components/molecules/UserList";
import Chatbox from "components/organisms/Chatbox";
import Room from "components/organisms/Room";
import { User } from "types/User";

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
            TableComponent={FriendShipTableComponent}
            joinMessage={false}
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
        <div className="chatbox-wrapper">
          <div className="col-5">
            <Chatbox room={selectedTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jazz;
