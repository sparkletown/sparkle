import React from "react";

import Room from "components/organisms/Room";
import { User } from "types/User";

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
