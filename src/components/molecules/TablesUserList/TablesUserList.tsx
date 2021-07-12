import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import firebase from "firebase/app";

import {
  DEFAULT_TABLE_ROWS,
  DEFAULT_TABLE_COLUMNS,
  DEFAULT_TABLE_CAPACITY,
  ALLOWED_EMPTY_TABLES_NUMBER,
} from "settings";

import { Table, TableComponentPropsType } from "types/Table";
import { User } from "types/User";

import { experienceSelector } from "utils/selectors";
import { isTruthy } from "utils/types";
import { getUserExperience } from "utils/user";

import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useRecentVenueUsers } from "hooks/users";

import { StartTable } from "components/molecules/StartTable";
import { Loading } from "components/molecules/Loading";

import "./TablesUserList.scss";

// @debt refactor this into src/settings or similar
const DEFAULT_TABLE_COUNT = 4;

// @debt replace this with generateTables from src/utils/table.ts
const createTable = (i: number): Table => {
  return {
    title: `Table ${i + 1}`,
    reference: `Table ${i + 1}`,
    capacity: DEFAULT_TABLE_CAPACITY,
    rows: DEFAULT_TABLE_ROWS,
    columns: DEFAULT_TABLE_COLUMNS,
  };
};

// @debt Remove this eslint-disable + fix the any type properly + move to api/* or remove outright
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const firestoreUpdate = (doc: string, update: any) => {
  const firestore = firebase.firestore();
  firestore
    .doc(doc)
    .update(update)
    .catch(() => {
      firestore.doc(doc).set(update);
    });
};

const defaultTables = [...Array(DEFAULT_TABLE_COUNT)].map((_, i: number) =>
  createTable(i)
);

export interface TablesUserListProps {
  venueName: string;
  setSeatedAtTable: (value: string) => void;
  seatedAtTable: string;
  customTables: Table[];
  showAvailableTables: boolean;
  TableComponent: React.FC<TableComponentPropsType>;
  joinMessage: boolean;
  leaveText?: string;
}

export const TablesUserList: React.FC<TablesUserListProps> = ({
  venueName,
  setSeatedAtTable,
  seatedAtTable,
  customTables,
  showAvailableTables,
  TableComponent,
  joinMessage,
}) => {
  const {
    isShown: isLockedMessageVisible,
    show: showLockedMessage,
    hide: hideLockedMessage,
  } = useShowHide(false);

  const {
    isShown: isJoinMessageVisible,
    show: showJoinMessage,
    hide: hideJoinMessage,
  } = useShowHide(false);

  const [joiningTable, setJoiningTable] = useState("");
  const [videoRoom, setVideoRoom] = useState("");

  const { user, profile } = useUser();
  const { recentVenueUsers, isRecentVenueUsersLoaded } = useRecentVenueUsers({
    venueName,
  });
  const experience = useSelector(experienceSelector);

  const tables: Table[] = customTables || defaultTables;

  const { table: userTable } = getUserExperience(venueName)(profile) ?? {};

  useEffect(() => {
    userTable ? setSeatedAtTable(userTable) : setSeatedAtTable("");
  }, [setSeatedAtTable, userTable]);

  const isSeatedAtTable = seatedAtTable !== "";

  // @debt can we refactor this to make use of makeUpdateUserGridLocation ?
  // @debt refactor this into api/* layer or similar?
  const takeSeat = useCallback(
    (table: string) => {
      if (!user) return;

      const doc = `users/${user.uid}`;
      const existingData = recentVenueUsers.find((u) => u.id === user.uid)
        ?.data;

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
    },
    [recentVenueUsers, user, venueName, videoRoom]
  );

  // @debt refactor table properties into one place
  const isLockedTable = useCallback(
    (table: string) => isTruthy(experience?.tables?.[table]?.locked),
    [experience?.tables]
  );

  // @debt refactor table properties into one place
  const isFullTable = useCallback(
    (table: Table) => {
      const usersSeatedAtTable = recentVenueUsers.filter(
        (user: User) =>
          getUserExperience(venueName)(user)?.table === table.reference
      );
      const numberOfSeatsLeft =
        table.capacity && table.capacity - usersSeatedAtTable.length;
      return numberOfSeatsLeft === 0;
    },
    [recentVenueUsers, venueName]
  );

  const tableLocked = useCallback(
    (table: string) => {
      // @debt refactor table properties into one place
      const areUsersAtTable = recentVenueUsers.some(
        (user: User) => getUserExperience(venueName)(user)?.table === table
      );

      // Empty tables are never locked
      if (!areUsersAtTable) return false;

      // Locked state is in the experience record
      return isLockedTable(table);
    },
    [recentVenueUsers, venueName, isLockedTable]
  );

  const onAcceptJoinMessage = useCallback(
    (table: string) => {
      window.scrollTo(0, 0);
      hideJoinMessage();
      takeSeat(table);
      setSeatedAtTable(table);
    },
    [hideJoinMessage, setSeatedAtTable, takeSeat]
  );

  const acceptJoiningTable = useCallback(
    () => onAcceptJoinMessage(joiningTable),
    [joiningTable, onAcceptJoinMessage]
  );

  const onJoinClicked = useCallback(
    (table: string, locked: boolean, videoRoom: string) => {
      if (locked) {
        showLockedMessage();
      } else {
        setJoiningTable(table);
        setVideoRoom(videoRoom);
        joinMessage ? showJoinMessage() : onAcceptJoinMessage(table);
      }
    },
    [joinMessage, onAcceptJoinMessage, showJoinMessage, showLockedMessage]
  );

  // @debt refactor table properties into one place
  const emptyTables = useMemo(
    () =>
      tables.filter(
        (table) =>
          !recentVenueUsers.some(
            (user: User) =>
              getUserExperience(venueName)(user)?.table === table.reference
          )
      ),
    [recentVenueUsers, tables, venueName]
  );

  const canStartTable =
    emptyTables.length <= ALLOWED_EMPTY_TABLES_NUMBER && !isSeatedAtTable;

  const renderedTables = useMemo(() => {
    if (isSeatedAtTable) return;

    // @debt refactor table properties into one place
    const tablesToShow = showAvailableTables
      ? tables.filter(
          (table) => !(isFullTable(table) || isLockedTable(table.reference))
        )
      : tables;

    return tablesToShow.map((table: Table, index: number) => (
      <TableComponent
        key={table.reference}
        experienceName={venueName}
        users={recentVenueUsers}
        table={table}
        tableLocked={tableLocked}
        onJoinClicked={onJoinClicked}
        // @debt should this be using the table.reference (rather than index) for nameOfVideoRoom?
        nameOfVideoRoom={`${venueName}-table${index + 1}`}
      />
    ));
  }, [
    TableComponent,
    isSeatedAtTable,
    onJoinClicked,
    recentVenueUsers,
    tableLocked,
    tables,
    showAvailableTables,
    isLockedTable,
    isFullTable,
    venueName,
  ]);

  if (!isRecentVenueUsersLoaded) return <Loading />;

  return (
    <>
      {renderedTables}
      {canStartTable && (
        <StartTable tables={tables} newTable={createTable(tables.length)} />
      )}
      <Modal show={isLockedMessageVisible} onHide={hideLockedMessage}>
        <Modal.Body>
          <div className="modal-container modal-container_message">
            <p>{`Can't join this table because it's been locked.`}</p>

            <p>Perhaps ask in the chat?</p>

            <button
              type="button"
              className="btn btn-block btn-centered"
              onClick={hideLockedMessage}
            >
              Back
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={isJoinMessageVisible} onHide={hideJoinMessage}>
        <Modal.Body>
          <div className="modal-container modal-container_message">
            <p>
              To avoid feedback from the music, we recommend wearing headphones.
            </p>

            <p>You can also adjust the volume on the live stream.</p>

            <button
              type="button"
              className="btn btn-block btn-centered"
              onClick={acceptJoiningTable}
            >
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
