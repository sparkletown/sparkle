import React, { useEffect, useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import firebase from "firebase/app";
import { Modal } from "react-bootstrap";

import UserProfileModal from "components/organisms/UserProfileModal";

import "./TablesUserList.scss";
import { User } from "types/User";
import { Table, TableComponentPropsType } from "types/Table";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  venueName: string;
  setSeatedAtTable: (value: string) => void;
  seatedAtTable: string;
  customTables?: Table[];
  TableComponent: React.FC<TableComponentPropsType>;
  joinMessage: boolean;
  leaveText?: string;
}

const TABLES = 4;

const createTable = (i: number): Table => {
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
    .catch(() => {
      firestore.doc(doc).set(update);
    });
};

const defaultTables = [...Array(TABLES)].map((_, i: number) => createTable(i));

const TablesUserList: React.FunctionComponent<PropsType> = ({
  venueName,
  setSeatedAtTable,
  seatedAtTable,
  customTables,
  TableComponent,
  joinMessage,
}) => {
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [joiningTable, setJoiningTable] = useState("");
  const [videoRoom, setVideoRoom] = useState("");

  const nameOfVideoRoom = (i: number) => {
    return `${venueName}-table${i + 1}`;
  };

  useFirestoreConnect({ collection: "experiences", doc: venueName });
  const { user, profile } = useUser();
  const { users, experience, usersById } = useSelector((state) => ({
    users: state.firestore.ordered.partygoers,
    usersById: state.firestore.data.users,
    experience:
      state.firestore.data.experiences &&
      state.firestore.data.experiences[venueName],
  }));

  useEffect(() => {
    if (!profile) return;
    const table = profile.data?.[venueName]?.table;
    if (table) {
      setSeatedAtTable(table);
    } else {
      setSeatedAtTable("");
    }
  }, [profile, setSeatedAtTable, user, usersById, venueName]);

  if (!users) {
    return <>Loading...</>;
  }

  const tables: Table[] = customTables || defaultTables;
  const usersAtTables: Record<string, Array<User>> = {};
  for (const table of tables) {
    usersAtTables[table.reference] = [];
  }
  const unseatedUsers = [];
  for (const u of users.filter((u: User) => u.lastSeenIn === venueName)) {
    if (
      u.data &&
      u.data[venueName] &&
      u.data[venueName].table &&
      tables
        .map((table: Table) => table.reference)
        .includes(u.data[venueName].table)
    ) {
      usersAtTables[u.data[venueName].table].push(u);
    } else {
      unseatedUsers.push(u);
    }
  }

  const tableLocked = (table: string) => {
    // Empty tables are never locked
    if (
      users &&
      users.filter((user: User) => user.data?.[venueName]?.table === table)
        .length === 0
    ) {
      return false;
    }
    // Locked state is in the experience record
    return !!experience?.tables?.[table]?.locked;
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
    if (!user) return;
    const doc = `users/${user.uid}`;
    const existingData = users.find((u) => u.id === user.uid)?.data;
    const update = {
      data: {
        ...existingData,
        [venueName]: {
          table,
          videoRoom,
        },
      },
    };
    firestoreUpdate(doc, update);
  };

  const usersAtOtherTables = [];
  for (const table of tables) {
    if (table.reference === seatedAtTable) {
      continue;
    }
    usersAtOtherTables.push(...usersAtTables[table.reference]);
  }

  return (
    <>
      {seatedAtTable !== "" ? (
        <></>
      ) : (
        <>
          {tables.map((table: Table, i: number) => (
            <TableComponent
              key={table.title}
              experienceName={venueName}
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
            <p>{`Can't join this table because it's been locked.`}</p>
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
