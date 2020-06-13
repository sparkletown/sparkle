import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import firebase from "firebase/app";
import { Modal } from "react-bootstrap";

import UserProfileModal from "components/organisms/UserProfileModal";
import Room from "pages/JazzBar/components/Room";

import "./TablesUserList.scss";

import { EXPERIENCE_NAME } from "config";

// https://stackoverflow.com/questions/39084924/componentwillunmount-not-being-called-when-refreshing-the-current-page#answer-39085062
const useWindowUnloadEffect = (handler: any, callOnCleanup: boolean) => {
  const cb = useRef();

  cb.current = handler;

  useEffect(() => {
    // @ts-ignore
    const handler = () => cb.current();

    window.addEventListener("beforeunload", handler);

    return () => {
      if (callOnCleanup) handler();

      window.removeEventListener("beforeunload", handler);
    };
  }, [cb]);
};

interface User {
  id: string;
  drinkOfChoice?: string;
  favouriteRecord?: string;
  doYouDance?: string;
  partyName?: string;
  pictureUrl?: string;
  data: { [key: string]: any };
}

interface PropsType {
  limit?: number;
  imageSize?: number;
  setUserList: any;
}

const TABLES = 8;
const TABLE_CAPACITY = 7;

const nameOfTable = (i: number) => {
  return `${i + 1}`;
};

const nameOfVideoRoom = (i: number) => {
  return `jazz-table${i + 1}`;
};

const firestoreUpdate = (doc: string, update: any) => {
  const firestore = firebase.firestore();
  firestore
    .doc(doc)
    .update(update)
    .catch((e) => {
      firestore.doc(doc).set(update);
    });
};

const tableNames = () => {
  return [...Array(TABLES)].map((_, i: number) => nameOfTable(i));
};

const TablesUserList: React.FunctionComponent<PropsType> = ({
  limit = 60,
  imageSize = 35,
  setUserList,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [showLeaveMessage, setShowLeaveMessage] = useState(false);
  const [table, setTable] = useState("");
  const [videoRoom, setVideoRoom] = useState("");

  useFirestoreConnect({ collection: "experiences", doc: EXPERIENCE_NAME });
  const { user, users, experience } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.ordered.users,
    experience:
      state.firestore.data.experiences &&
      state.firestore.data.experiences[EXPERIENCE_NAME],
  }));

  useWindowUnloadEffect(() => leaveSeat(), true);

  // const userData = users?.find((u: any) => u.id === user.uid)?.data?.[
  //   EXPERIENCE_NAME
  // ];
  const leaveSeat = useCallback(() => {
    const doc = `users/${user.uid}`;
    // const existingData = userData;
    const update = {
      data: {
        [EXPERIENCE_NAME]: {
          // ...existingData,
          table: null,
          videoRoom: null,
        },
      },
    };
    firestoreUpdate(doc, update);
  }, [user]);

  if (!users) {
    return <>"Loading...";</>;
  }

  let seatedAtTableName = "";
  const tables = tableNames();
  const usersAtTables: { [key: string]: any } = {};
  for (const tableName of tables) {
    usersAtTables[tableName] = [];
  }
  const unseatedUsers = [];
  for (const u of users) {
    if (
      u.data &&
      u.data[EXPERIENCE_NAME] &&
      u.data[EXPERIENCE_NAME].table &&
      tables.includes(u.data[EXPERIENCE_NAME].table)
    ) {
      usersAtTables[u.data[EXPERIENCE_NAME].table].push(u);
      if (u.id === user.uid) {
        seatedAtTableName = u.data[EXPERIENCE_NAME].table;
      }
    } else {
      unseatedUsers.push(u);
    }
  }

  const usersToDisplay = isExpanded
    ? unseatedUsers.slice(0, 25)
    : unseatedUsers.slice(0, limit);

  const tableLocked = (
    table: string,
    usersAtTables: { [key: string]: User[] }
  ) => {
    // Empty tables are never locked
    if (usersAtTables[table] && !usersAtTables[table].length) {
      return false;
    }
    // Locked state is in the experience record
    return (
      experience &&
      experience.tables &&
      experience.tables[table] &&
      experience.tables[table].locked
    );
  };

  const onLockedChanged = (tableName: string, locked: boolean) => {
    const doc = `experiences/${EXPERIENCE_NAME}`;
    const update = {
      tables: { ...experience?.tables, [tableName]: { locked } },
    };
    firestoreUpdate(doc, update);
  };

  const onJoinClicked = (table: string, locked: boolean, videoRoom: string) => {
    if (locked) {
      setShowLockedMessage(true);
    } else {
      setTable(table);
      setVideoRoom(videoRoom);
      setShowJoinMessage(true);
    }
  };

  const onAcceptJoinMessage = () => {
    setShowJoinMessage(false);
    takeSeat();
  };

  const onAcceptLeaveMessage = () => {
    setShowLeaveMessage(false);
    leaveSeat();
  };

  const takeSeat = () => {
    const doc = `users/${user.uid}`;
    const existingData = users.find((u: any) => u.id === user.uid)?.data?.[
      EXPERIENCE_NAME
    ];
    const update = {
      data: { [EXPERIENCE_NAME]: { ...existingData, table, videoRoom } },
    };
    firestoreUpdate(doc, update);
  };

  const atTable = (table: string, usersAtTables: { [key: string]: User[] }) => {
    if (usersAtTables && usersAtTables[table]) {
      for (const userAtTable of usersAtTables[table]) {
        if (userAtTable.id === user.uid) {
          return true;
        }
      }
    }
    return false;
  };

  const usersAtOtherTables = [];
  for (const table of tables) {
    if (table === seatedAtTableName) {
      continue;
    }
    usersAtOtherTables.push(...usersAtTables[table]);
  }

  const displayUsers = [];
  for (const table of tables) {
    displayUsers.push(...usersAtTables[table]);
  }
  displayUsers.push(...usersToDisplay);

  return (
    <>
      <div className="userlist-container">
        <div className="row header no-margin">
          <p>
            <span className="bold">{displayUsers.length}</span>{" "}
            {displayUsers.length !== 1 ? "people" : "person"} listening to jazz
          </p>
        </div>
        {seatedAtTableName !== "" ? (
          <>
            <div className="row no-margin at-table">
              <div className="header">
                <p>Table {seatedAtTableName}</p>
                <button
                  type="button"
                  title={"Leave " + seatedAtTableName}
                  className="btn"
                  onClick={() => setShowLeaveMessage(true)}
                >
                  Leave
                </button>
              </div>
              <div className="actions">
                {tableLocked(seatedAtTableName, usersAtTables) ? (
                  <p className="locked-text">Table is locked</p>
                ) : (
                  <p className="unlocked-text">Others can join this table</p>
                )}
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!tableLocked(seatedAtTableName, usersAtTables)}
                    onChange={() =>
                      onLockedChanged(
                        seatedAtTableName,
                        !tableLocked(seatedAtTableName, usersAtTables)
                      )
                    }
                  />
                  <span className="slider" />
                </label>
              </div>
              <div className="row">
                <div className="wrapper">
                  <Room
                    roomName={seatedAtTableName}
                    setUserList={setUserList}
                  />
                </div>
              </div>
              <div className="footer"></div>
            </div>
            <div className="header">
              <p>
                <span className="bold">{usersAtOtherTables.length}</span>{" "}
                {usersAtOtherTables.length === 1
                  ? "person at another table"
                  : "people at other tables"}
              </p>
            </div>
            <div className="profiles">
              {usersAtOtherTables.map((user: User) => (
                <img
                  onClick={() => setSelectedUserProfile(user)}
                  key={user.id}
                  className="profile-icon"
                  src={user.pictureUrl || "/anonymous-profile-icon.jpeg"}
                  title={user.partyName}
                  alt={`${user.partyName} profile`}
                  width={imageSize}
                  height={imageSize}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {tables.map((tableName: string, i: number) => {
              const locked = tableLocked(tableName, usersAtTables);
              const people = usersAtTables[tableName].length;
              return (
                <>
                  <div className="profiles">
                    <span>{tableName}</span>
                    <span>
                      {usersAtTables[tableName].map((user: User) => (
                        <img
                          onClick={() => setSelectedUserProfile(user)}
                          key={user.id}
                          className="profile-icon"
                          src={
                            user.pictureUrl || "/anonymous-profile-icon.jpeg"
                          }
                          title={user.partyName}
                          alt={`${user.partyName} profile`}
                          width={imageSize}
                          height={imageSize}
                        />
                      ))}
                      {usersAtTables[tableName].length === 0 &&
                        "No one is at this table"}
                    </span>
                    {people >= TABLE_CAPACITY ? (
                      <button
                        type="button"
                        title={tableName + " is full"}
                        className={"btn disabled"}
                        disabled
                      >
                        Full
                      </button>
                    ) : (
                      <button
                        type="button"
                        title={"Join " + tableName}
                        className={"btn " + (locked ? "disabled" : "")}
                        onClick={() =>
                          onJoinClicked(tableName, locked, nameOfVideoRoom(i))
                        }
                      >
                        Join
                      </button>
                    )}
                  </div>
                </>
              );
            })}
          </>
        )}
        <div className="row header no-margin">
          <p>
            <span className="bold">{usersToDisplay.length}</span> standing
          </p>
          {usersToDisplay.length > limit && (
            <p
              className="clickable-text"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              See {isExpanded ? "less" : "all"}
            </p>
          )}
        </div>
        <div className="row no-margin">
          {usersToDisplay.map((user) => (
            <img
              onClick={() => setSelectedUserProfile(user)}
              key={user.id}
              className="profile-icon"
              src={user.pictureUrl || "/anonymous-profile-icon.jpeg"}
              title={user.partyName}
              alt={`${user.partyName} profile`}
              width={imageSize}
              height={imageSize}
            />
          ))}
        </div>
      </div>
      <UserProfileModal
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
        userProfile={selectedUserProfile}
      />
      <Modal
        show={showLockedMessage}
        onHide={() => setShowLockedMessage(false)}
      >
        <Modal.Body>
          <div className="modal-container modal-container_message">
            <p>Can't join this table because it's been locked.</p>
            <p>Perhaps ask in the chat?</p>
            <button
              type="button"
              className="btn btn-block btn-centered"
              onClick={() => setShowLockedMessage(false)}
            >
              Return to the Jazz
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showJoinMessage} onHide={() => setShowJoinMessage(false)}>
        <Modal.Body>
          <div className="modal-container modal-container_message">
            <p>
              To avoid feedback from the music, we recommend wearing headphones.
            </p>
            <p>You can also adjust the volume on the live stream.</p>
            <button
              type="button"
              className="btn btn-block btn-centered"
              onClick={() => onAcceptJoinMessage()}
            >
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showLeaveMessage} onHide={() => setShowLeaveMessage(false)}>
        <Modal.Body>
          <div className="modal-container modal-container_message">
            <p>Are you sure you want to leave the table?</p>
            <button
              type="button"
              className="btn btn-block btn-centered"
              onClick={() => onAcceptLeaveMessage()}
            >
              Leave the Table
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TablesUserList;
