import React, { useCallback, useContext, useState, useEffect } from "react";
import { User as FUser } from "firebase";
import { useFirestoreConnect } from "react-redux-firebase";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { TOGGLE_MUTE_REACTIONS } from "actions";
import "./Jazz.scss";
import "./TableHeader.scss";
import TablesUserList from "components/molecules/TablesUserList";
import { useDispatch, useSelector } from "react-redux";
import { PARTY_NAME } from "config";
import TableComponent from "components/molecules/TableComponent";
import UserList from "components/molecules/UserList";
import Room from "components/organisms/Room";
import { User } from "types/User";
import { JAZZBAR_TABLES } from "./constants";
import {
  ExperienceContext,
  Reactions,
  EmojiReactionType,
  TextReactionType,
  Reaction,
} from "components/context/ExperienceContext";
import firebase from "firebase/app";
import CallOutMessageForm from "./CallOutMessageForm";

interface PropsType {
  setUserList: (value: User[]) => void;
}

interface ChatOutDataType {
  messageToTheBand: string;
}

const TableHeader = ({
  seatedAtTable,
  setSeatedAtTable,
  experienceName,
}: any) => {
  const { experience, user, users } = useSelector((state: any) => ({
    experience:
      state.firestore.data.experiences &&
      state.firestore.data.experiences[experienceName],
    user: state.user,
    users: state.firestore.ordered.partygoers,
  }));
  useFirestoreConnect({
    collection: "experiences",
    doc: experienceName,
  });
  const tableOfUser =
    seatedAtTable &&
    JAZZBAR_TABLES.find((table) => table.reference === seatedAtTable);

  const usersAtCurrentTable =
    seatedAtTable &&
    users &&
    users.filter(
      (user: User) => user.data?.[experienceName]?.table === seatedAtTable
    );

  const firestoreUpdate = (doc: string, update: any) => {
    const firestore = firebase.firestore();
    firestore
      .doc(doc)
      .update(update)
      .catch((e) => {
        firestore.doc(doc).set(update);
      });
  };

  const tableLocked = (table: string) => {
    // Empty tables are never locked
    if (
      users &&
      users.filter((user: User) => user.data?.[experienceName]?.table === table)
        .length === 0
    ) {
      return false;
    }
    // Locked state is in the experience record
    return experience?.tables?.[table]?.locked;
  };

  const onLockedChanged = (tableName: string, locked: boolean) => {
    const doc = `experiences/${experienceName}`;
    const update = {
      tables: { ...experience?.tables, [tableName]: { locked } },
    };
    firestoreUpdate(doc, update);
  };

  // useWindowUnloadEffect(() => leaveSeat(), true);

  const leaveSeat = useCallback(async () => {
    const doc = `users/${user.uid}`;
    const existingData = user.data;
    const update = {
      data: {
        ...existingData,
        [experienceName]: {
          table: null,
          videoRoom: null,
        },
      },
    };
    await firestoreUpdate(doc, update);
    setSeatedAtTable("");
  }, [user, setSeatedAtTable, experienceName]);

  return (
    <div className="row no-margin at-table table-header">
      <div className="header" style={{ marginRight: "60px" }}>
        <div className="action">
          <button
            type="button"
            title={"Leave " + seatedAtTable}
            className="btn"
            onClick={leaveSeat}
          >
            Back
          </button>
        </div>
        <div className="table-title-container">
          <div className="private-table-title" style={{ fontSize: "20px" }}>
            {tableOfUser?.title || seatedAtTable}
            {tableOfUser && tableOfUser.capacity && (
              <>
                {" "}
                <span style={{ fontSize: "12px" }}>
                  (
                  {usersAtCurrentTable &&
                    `${tableOfUser.capacity - usersAtCurrentTable.length}`}{" "}
                  seats left )
                </span>
              </>
            )}
          </div>
          {tableOfUser && tableOfUser.subtitle && (
            <div className="private-table-subtitle">{tableOfUser.subtitle}</div>
          )}
        </div>
        <div className="action">
          <label className="switch">
            <input
              type="checkbox"
              checked={!tableLocked(seatedAtTable)}
              onChange={() =>
                onLockedChanged(seatedAtTable, !tableLocked(seatedAtTable))
              }
            />
            <span className="slider" />
          </label>
          <div className="lock-table-checbox-indication">
            {tableLocked(seatedAtTable) ? (
              <p className="locked-text">Table is locked</p>
            ) : (
              <p className="unlocked-text">Others can join this table</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TableFooter = ({ isVideoFocused, setIsVideoFocused }: any) => (
  <div className="table-footer">
    <div className="actions">
      <div className="action">
        {/* <div className="full-screen-checkbox"> */}
        <div className="focus">Focus on:</div>
        <div className="focus-option">Jazz</div>
        <label className="switch">
          <input
            type="checkbox"
            checked={!isVideoFocused}
            onChange={() => setIsVideoFocused(!isVideoFocused)}
          />
          <span className="slider" />
        </label>
        <div className="focus-option">Friends</div>
        {/* </div> */}
      </div>
    </div>
  </div>
);

const Jazz: React.FunctionComponent<PropsType> = ({ setUserList }) => {
  const dispatch = useDispatch();
  const { experience, user, users, muteReactions } = useSelector(
    (state: any) => ({
      experience:
        state.firestore.data.config?.[PARTY_NAME]?.experiences.jazzbar,
      user: state.user,
      users: state.firestore.ordered.partygoers,
      muteReactions: state.muteReactions,
    })
  );

  const [isMessageToTheBandSent, setIsMessageToTheBandSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBandSent) {
      setTimeout(() => {
        setIsMessageToTheBandSent(false);
      }, 2000);
    }
  }, [isMessageToTheBandSent, setIsMessageToTheBandSent]);

  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const experienceContext = useContext(ExperienceContext);

  const [seatedAtTable, setSeatedAtTable] = useState("");

  const usersInJazzBar =
    users &&
    experience &&
    users.filter((user: User) => user.lastSeenIn === experience.associatedRoom);

  const usersAtSameTable =
    users &&
    experience &&
    users.filter(
      (user: User) =>
        user.data?.[experience.associatedRoom] &&
        user.data[experience.associatedRoom].table === seatedAtTable
    );

  const usersInJazzbarWithoutPeopleAtTable =
    users &&
    experience &&
    usersAtSameTable &&
    users.filter(
      (user: User) =>
        usersInJazzBar.includes(user) && !usersAtSameTable.includes(user)
    );

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

  function createReaction(
    reaction: { reaction: EmojiReactionType },
    user: FUser
  ): Reaction;
  function createReaction(
    reaction: { reaction: TextReactionType; text: string },
    user: FUser
  ): Reaction;
  function createReaction(reaction: any, user: FUser) {
    return {
      created_at: new Date().getTime(),
      created_by: user.uid,
      ...reaction,
    };
  }

  const reactionClicked = (user: FUser, reaction: EmojiReactionType) => {
    experienceContext &&
      experienceContext.addReaction(createReaction({ reaction }, user));
    setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
  };

  const { register, handleSubmit, setValue } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: ChatOutDataType) => {
    experienceContext &&
      experienceContext.addReaction(
        createReaction(
          { reaction: "messageToTheBand", text: data.messageToTheBand },
          user
        )
      );
    setValue([{ messageToTheBand: "" }]);
    setIsMessageToTheBandSent(true);
  };

  return (
    <div className="scrollable-area">
      <div className="user-interaction-container">
        {users && (
          <UserList
            users={
              seatedAtTable
                ? usersInJazzbarWithoutPeopleAtTable
                : usersInJazzBar
            }
            limit={26}
            activity="in the jazz bar"
          />
        )}
      </div>
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
            joinMessage={true}
            customTables={JAZZBAR_TABLES}
          />
        )}

        <div
          className={`jazz-container ${
            !seatedAtTable ? "container-in-grid" : "container-in-row "
          }`}
        >
          <div
            key="main-event-container"
            className={`video ${
              seatedAtTable
                ? isVideoFocused
                  ? "video-focused col-11"
                  : "col-5 video-not-focused"
                : ""
            }`}
          >
            <iframe
              key="main-event"
              title="main event"
              width="100%"
              height="100%"
              className="youtube-video"
              src="https://www.youtube.com/embed/dqZAA8ZIAVE?autoplay=1"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
            />
            {seatedAtTable && (
              <div className="call-out-band-container-at-table">
                <CallOutMessageForm
                  onSubmit={handleSubmit(onSubmit)}
                  isMessageToTheBandSent={isMessageToTheBandSent}
                  register={register}
                />
              </div>
            )}
          </div>
          <div
            className={`reaction-bar ${
              isVideoFocused ? "video-focused" : "video-not-focused"
            }`}
          >
            {!seatedAtTable && (
              <div className="call-out-band-container">
                <CallOutMessageForm
                  onSubmit={handleSubmit(onSubmit)}
                  isMessageToTheBandSent={isMessageToTheBandSent}
                  register={register}
                />
              </div>
            )}
            <div className="emoji-container">
              {Reactions.map((reaction) => (
                <div className="reaction-container">
                  <button
                    className="reaction"
                    onClick={() => reactionClicked(user, reaction.type)}
                  >
                    <span role="img" aria-label={reaction.ariaLabel}>
                      {reaction.text}
                    </span>
                  </button>
                </div>
              ))}
            </div>
            <div
              className="reaction-mute"
              onClick={() => dispatch({ type: TOGGLE_MUTE_REACTIONS })}
            >
              <div className="reaction-mute-text">Reactions:</div>
              <FontAwesomeIcon
                size="lg"
                icon={muteReactions ? faVolumeMute : faVolumeUp}
                color={muteReactions ? "red" : undefined}
              />
            </div>
          </div>
        </div>
        {seatedAtTable && (
          <div className="container-in-row">
            <div
              className={`${
                isVideoFocused ? "col-5" : "col-12"
              } table-container`}
            >
              <TableHeader
                seatedAtTable={seatedAtTable}
                setSeatedAtTable={setSeatedAtTable}
                experienceName={experience.associatedRoom}
              />
              <div className="jazz-wrapper">
                <Room roomName={seatedAtTable} setUserList={setUserList} />
              </div>
              <TableFooter
                isVideoFocused={isVideoFocused}
                setIsVideoFocused={setIsVideoFocused}
              />
            </div>
          </div>
        )}
      </div>
      {!seatedAtTable && (
        <div className="user-interaction-container">
          {usersStanding && (
            <UserList users={usersStanding} limit={26} activity="standing" />
          )}
        </div>
      )}
    </div>
  );
};

export default Jazz;
