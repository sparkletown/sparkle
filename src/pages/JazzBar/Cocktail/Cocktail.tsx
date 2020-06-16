import React from "react";

import Room from "components/organisms/Room";
import "./Cocktail.scss";
import { User } from "components/organisms/UserProfileModal/UserProfileModal";

const ROOM_NAME = "jazz-cocktail";

const Cocktail = ({
  setUserList,
}: {
  setUserList: (userList: User[]) => void;
}) => {
  return (
    <div className="cocktail">
      <div className="wrapper">
        <Room roomName={ROOM_NAME} setUserList={setUserList} />
      </div>
    </div>
  );
};

export default Cocktail;
