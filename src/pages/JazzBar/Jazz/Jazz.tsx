import React from "react";
import { useSelector } from "react-redux";

import Room from "../components/Room";
import { User } from "components/organisms/UserProfileModal/UserProfileModal";

import { EXPERIENCE_NAME } from "config";

interface PropsType {
  setUserList: (userList: User[]) => void;
}

const Jazz: React.FunctionComponent<PropsType> = ({ setUserList }) => {
  const { user, users } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));

  const roomName =
    user &&
    users &&
    users[user.uid] &&
    users[user.uid].data &&
    users[user.uid].data[EXPERIENCE_NAME] &&
    users[user.uid].data[EXPERIENCE_NAME].videoRoom;

  return (
    <>
      <iframe
        title="main event"
        width="100%"
        height="100%"
        className={"col youtube-video"}
        src="https://www.youtube.com/embed/x0RV0kgdqJU"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      {roomName && <Room roomName={roomName} setUserList={setUserList} />}
    </>
  );
};

export default Jazz;
