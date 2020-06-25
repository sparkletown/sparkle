import React, { useContext, useState } from "react";
import { User as FUser } from "firebase";

import "./Jazz.scss";
import TablesUserList from "components/molecules/TablesUserList";
import { useSelector } from "react-redux";
import { PARTY_NAME } from "config";
import TableComponent from "components/molecules/TableComponent";
import UserList from "components/molecules/UserList";
import Room from "components/organisms/Room";
import { User } from "types/User";
import { JAZZBAR_TABLES } from "./constants";
import { ExperienceContext } from "components/context/ExperienceContext";

interface PropsType {
  selectedTab: string;
  setUserList: (value: User[]) => void;
}

const Jazz: React.FunctionComponent<PropsType> = ({
  selectedTab,
  setUserList,
}) => {
  const { experience, user, users } = useSelector((state: any) => ({
    experience: state.firestore.data.config?.[PARTY_NAME]?.experiences.jazzbar,
    user: state.user,
    users: state.firestore.ordered.partygoers,
  }));
  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const experienceContext = useContext(ExperienceContext);

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

  const reactionClicked = (user: FUser) => {
    experienceContext &&
      experienceContext.addReaction({
        reaction: "heart",
        created_at: new Date().getTime(),
        created_by: user.uid,
      });
  };

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
            !seatedAtTable ? "container-in-grid" : "container-in-row "
          }`}
        >
          <div
            className={`video ${
              seatedAtTable
                ? isVideoFocused
                  ? "video-focused col-11"
                  : "col-5 video-not-focused"
                : ""
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
        </div>
        {seatedAtTable && (
          <div className="container-in-row">
            <div
              className={`${
                isVideoFocused ? "col-5" : "col-12"
              } table-container`}
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
              </div>
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
          <button onClick={() => reactionClicked(user)}>
            <span role="img" aria-label="heart-emoji">
              ❤️
            </span>
          </button>
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
