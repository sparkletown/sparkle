import React from "react";

import { User } from "components/organisms/UserProfileModal/UserProfileModal";
import "./Jazz.scss";

interface PropsType {
  setUserList: (userList: User[]) => void;
}

const Jazz: React.FunctionComponent<PropsType> = ({ setUserList }) => {
  return (
    <div className={"col jazz-container"}>
      <iframe
        title="main event"
        width="100%"
        height="100%"
        className={"youtube-video"}
        src="https://www.youtube.com/embed/cG9B6EhagdQ?autoplay=1"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default Jazz;
