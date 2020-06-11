import React from "react";

import Room from "../components/Room";
import { User } from "components/organisms/UserProfileModal/UserProfileModal";

const ROOM_NAME = "jazz-backstage";

const Backstage = ({
  setUserList,
}: {
  setUserList: (userList: User[]) => void;
}) => {
  return (
    <div className="backstage">
      <div className="wrapper">
        <Room roomName={ROOM_NAME} setUserList={setUserList} />
      </div>
    </div>
  );
};

export default Backstage;
