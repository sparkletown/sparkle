import React from "react";

import Room from "components/organisms/Room";
import "./CocktailTab.scss";
import { User } from "types/User";
import UserList from "components/molecules/UserList";
import { useSelector } from "react-redux";

const ROOM_NAME = "jazz-cocktail";

interface PropsType {
  userList: User[];
  setUserList: (value: User[]) => void;
}

const Cocktail: React.FunctionComponent<PropsType> = ({
  userList,
  setUserList,
}) => {
  const { users } = useSelector((state: any) => ({
    users: state.firestore.ordered.partygoers,
  }));
  return (
    <>
      <div className="row cocktail">
        <div className="col content">
          <div className="wrapper">
            <Room roomName={ROOM_NAME} setUserList={setUserList} />
          </div>
        </div>
      </div>
      <div className="row">
        {users && (
          <div className="col">
            <UserList users={userList} activity="at the bar" limit={24} />
          </div>
        )}
      </div>
    </>
  );
};

export default Cocktail;
