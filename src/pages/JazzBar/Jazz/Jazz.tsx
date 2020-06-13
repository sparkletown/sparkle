import React from "react";
import { useSelector } from "react-redux";

import Room from "../components/Room";
import { User } from "components/organisms/UserProfileModal/UserProfileModal";

import { EXPERIENCE_NAME } from "config";

import "./Jazz.scss";

interface PropsType {
  setUserList: (userList: User[]) => void;
}

const Jazz: React.FunctionComponent<PropsType> = ({ setUserList }) => {
  const { user, users } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));

  const roomName =
    user && users?.[user.uid]?.data?.[EXPERIENCE_NAME]?.videoRoom;
  const atTable = !!roomName;

  return (
    <div className={"col jazz-container " + (atTable ? "at-table" : "")}>
      <iframe
        title="main event"
        width="100%"
        height="100%"
        className={"youtube-video"}
        src="https://www.youtube.com/embed/UZQQJUw3R5g"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
      {atTable && (
        <div className="table">
          <Room roomName={roomName} setUserList={setUserList} />
        </div>
      )}
    </div>
  );
};

export default Jazz;
