import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import firebase from "firebase/app";

import UserProfileModal from "components/organisms/UserProfileModal";

import "./TablesUserList.scss";

import { EXPERIENCE_NAME } from "config";

interface User {
  id: string;
  gratefulFor?: string;
  islandCompanion?: string;
  likeAboutParties?: string;
  partyName?: string;
  pictureUrl?: string;
  data: { [key: string]: any };
}

interface PropsType {
  limit?: number;
  imageSize?: number;
}

const TABLES = 10;

const nameOfTable = (i: number) => {
  return `Table ${i + 1}`;
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
  imageSize = 40,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  useFirestoreConnect({ collection: "experiences", doc: EXPERIENCE_NAME });
  const { user, users, experience } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.ordered.users,
    experience:
      state.firestore.data.experiences &&
      state.firestore.data.experiences[EXPERIENCE_NAME],
  }));

  if (!users) {
    return <>"Loading...";</>;
  }

  const tables = tableNames();
  const usersAtTables: { [key: string]: any } = {};
  for (const tableName of tables) {
    usersAtTables[tableName] = [];
  }
  const unseatedUsers = [];
  for (const user of users) {
    if (
      user.data &&
      user.data[EXPERIENCE_NAME] &&
      user.data[EXPERIENCE_NAME].table &&
      tables.includes(user.data[EXPERIENCE_NAME].table)
    ) {
      usersAtTables[user.data[EXPERIENCE_NAME].table].push(user);
    } else {
      unseatedUsers.push(user);
    }
  }

  const usersToDisplay = isExpanded
    ? unseatedUsers
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
    const update = { tables: { [tableName]: { locked } } };
    firestoreUpdate(doc, update);
  };

  const takeSeat = (table: string, videoRoom: string) => {
    const doc = `users/${user.uid}`;
    const existingData = users.find((u: any) => u.id === user.uid)?.data?.[
      EXPERIENCE_NAME
    ];
    const update = {
      data: { [EXPERIENCE_NAME]: { ...existingData, table, videoRoom } },
    };
    firestoreUpdate(doc, update);
  };

  const leaveSeat = () => {
    const doc = `users/${user.uid}`;
    const existingData = users.find((u: any) => u.id === user.uid)?.data?.[
      EXPERIENCE_NAME
    ];
    const update = {
      data: {
        [EXPERIENCE_NAME]: { ...existingData, table: null, videoRoom: null },
      },
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

  return (
    <>
      <div className="userlist-container">
        <div className="row header no-margin">
          <p>
            <span className="bold">{users.length}</span>{" "}
            {users.length !== 1 ? "people" : "person"} listening to jazz
          </p>
        </div>
        {tables.map((tableName: string, i: number) => {
          const atCurrentTable = atTable(tableName, usersAtTables);
          const people =
            usersAtTables[tableName].length - (atCurrentTable ? 1 : 0);
          const plural = people !== 1;

          const tablePre = atCurrentTable ? "You're with" : "";
          const tablePost = `${
            atCurrentTable ? "other" + (plural ? "s" : "") : ""
          } at ${tableName}`;

          return (
            <>
              <div
                className={
                  "row no-margin " + (atCurrentTable ? "at-table" : "")
                }
              >
                <div className="header">
                  <p>
                    {tablePre} <span className="bold">{people}</span>{" "}
                    {tablePost}
                  </p>
                  {atCurrentTable ? (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => leaveSeat()}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={
                        "btn " +
                        (tableLocked(tableName, usersAtTables)
                          ? "disabled"
                          : "")
                      }
                      onClick={() => takeSeat(tableName, nameOfVideoRoom(i))}
                    >
                      Join
                    </button>
                  )}
                </div>
                <div className="profiles">
                  {usersAtTables[tableName].map((user: User) => (
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
                {atCurrentTable && (
                  <div className="footer">
                    <p>Allow Others To Join</p>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!tableLocked(tableName, usersAtTables)}
                        onChange={() =>
                          onLockedChanged(
                            tableName,
                            !tableLocked(tableName, usersAtTables)
                          )
                        }
                      />
                      <span className="slider" />
                    </label>
                  </div>
                )}
              </div>
            </>
          );
        })}
        <div className="row header no-margin">
          <p>
            <span className="bold">{unseatedUsers.length}</span> standing at the
            back
          </p>
          {unseatedUsers.length > limit && (
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
    </>
  );
};

export default TablesUserList;
