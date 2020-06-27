import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import firebase from "firebase/app";
import { Modal } from "react-bootstrap";

import UserProfileModal from "components/organisms/UserProfileModal";

import "./TablesUserList.scss";
import { User } from "types/User";
import { Table, TableComponentPropsType } from "types/Table";

// https://stackoverflow.com/questions/39084924/componentwillunmount-not-being-called-when-refreshing-the-current-page#answer-39085062
// const useWindowUnloadEffect = (handler: any, callOnCleanup: boolean) => {
//   const cb = useRef();

//   cb.current = handler;

//   useEffect(() => {
//     // @ts-ignore
//     const handler = () => cb.current();

//     window.addEventListener("beforeunload", handler);

//     return () => {
//       if (callOnCleanup) handler();

//       window.removeEventListener("beforeunload", handler);
//     };
//   }, [cb, callOnCleanup]);
// };

interface PropsType {
  experienceName: string;
  setSeatedAtTable: (value: string) => void;
  seatedAtTable: string;
  customTables?: Table[];
  TableComponent: React.FC<TableComponentPropsType>;
  joinMessage: boolean;
  leaveText?: string;
}

const TABLES = 4;

const createTable = (i: number) => {
  return {
    reference: `Table ${i + 1}`,
    capacity: 8,
    rows: 2,
    columns: 4,
  };
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

const defaultTables = [...Array(TABLES)].map((_, i: number) => createTable(i));

const TablesUserList: React.FunctionComponent<PropsType> = ({
  experienceName,
  setSeatedAtTable,
  seatedAtTable,
  customTables,
  TableComponent,
  joinMessage,
  leaveText = "Back",
}) => {
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [joiningTable, setJoiningTable] = useState("");
  const [videoRoom, setVideoRoom] = useState("");

  const nameOfVideoRoom = (i: number) => {
    return `${experienceName}-table${i + 1}`;
  };

  useFirestoreConnect({ collection: "experiences", doc: experienceName });
  const { user, users, experience, usersById } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.ordered.partygoers,
    usersById: state.firestore.data.users,
    experience:
      state.firestore.data.experiences &&
      state.firestore.data.experiences[experienceName],
  }));

  useEffect(() => {
    if (user && usersById?.[user.uid]?.data?.[experienceName]?.table) {
      setSeatedAtTable(usersById[user.uid].data[experienceName].table);
    } else {
      setSeatedAtTable("");
    }
  }, [user, setSeatedAtTable, usersById, experienceName]);

  if (!users) {
    return <>Loading...</>;
  }

  let seatedAtTableName = "";
  const tables: Table[] = customTables || defaultTables;
  const usersAtTables: { [key: string]: any } = {};
  for (const table of tables) {
    usersAtTables[table.reference] = [];
  }
  const unseatedUsers = [];
  for (const u of users.filter((u: User) => u.lastSeenIn === experienceName)) {
    if (
      u.data &&
      u.data[experienceName] &&
      u.data[experienceName].table &&
      tables
        .map((table: Table) => table.reference)
        .includes(u.data[experienceName].table)
    ) {
      usersAtTables[u.data[experienceName].table].push(u);
    } else {
      unseatedUsers.push(u);
    }
  }

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

  const onJoinClicked = (table: string, locked: boolean, videoRoom: string) => {
    if (locked) {
      setShowLockedMessage(true);
    } else {
      setJoiningTable(table);
      setVideoRoom(videoRoom);
      joinMessage ? setShowJoinMessage(true) : onAcceptJoinMessage();
    }
  };

  const onAcceptJoinMessage = () => {
    window.scrollTo(0, 0);
    setShowJoinMessage(false);
    takeSeat(joiningTable);
    setSeatedAtTable(joiningTable);
  };

  const takeSeat = (table: string) => {
    const doc = `users/${user.uid}`;
    const existingData = users.find((u: any) => u.id === user.uid)?.data?.[
      experienceName
    ];
    const update = {
      data: { [experienceName]: { ...existingData, table, videoRoom } },
    };
    firestoreUpdate(doc, update);
  };

  const usersAtOtherTables = [];
  for (const table of tables) {
    if (table.reference === seatedAtTableName) {
      continue;
    }
    usersAtOtherTables.push(...usersAtTables[table.reference]);
  }

  // const tableOfUser =
  //   seatedAtTable && tables.find((table) => table.reference === seatedAtTable);

  // const usersAtCurrentTable =
  //   seatedAtTable &&
  //   users &&
  //   users.filter(
  //     (user: User) => user.data?.[experienceName]?.table === seatedAtTable
  //   );

  return (
    <>
      {seatedAtTable !== "" ? (
        <>
          {/* <div className="row no-margin at-table">
            <div className="header">
              <div className="table-title-container">
                <div className="private-table-title">{seatedAtTable}</div>
                {tableOfUser && tableOfUser.subtitle && (
                  <div className="private-table-subtitle">
                    {tableOfUser.subtitle}
                  </div>
                )}
              </div>
              <div>
                {tableOfUser && tableOfUser.capacity && (
                  <div>
                    {usersAtCurrentTable &&
                      `${
                        tableOfUser.capacity - usersAtCurrentTable.length
                      }`}{" "}
                    seats left
                  </div>
                )}

                <button
                  type="button"
                  title={"Leave " + seatedAtTable}
                  className="btn"
                  onClick={leaveSeat}
                >
                  {leaveText}
                </button>
              </div>
            </div>
            <div className="actions">
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
          </div> */}
        </>
      ) : (
        <>
          {tables.map((table: Table, i: number) => (
            <TableComponent
              experienceName={experienceName}
              users={users}
              table={table}
              tableLocked={tableLocked}
              setSelectedUserProfile={setSelectedUserProfile}
              onJoinClicked={onJoinClicked}
              nameOfVideoRoom={nameOfVideoRoom(i)}
            />
          ))}
        </>
      )}
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
              Back
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
    </>
  );
};

export default TablesUserList;
