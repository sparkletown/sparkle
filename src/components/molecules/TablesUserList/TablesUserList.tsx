import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import firebase from "firebase/app";

import { ALLOWED_EMPTY_TABLES_NUMBER } from "settings";

import { Table, TableComponentPropsType } from "types/Table";
import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { experienceSelector } from "utils/selectors";
import { generateTable } from "utils/table";
import { isTruthy } from "utils/types";
import { getUserExperience } from "utils/user";

import { useRecentVenueUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";
import { StartTable } from "components/molecules/StartTable";

import "./TablesUserList.scss";

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

export interface TablesUserListProps {
  venue: AnyVenue;
  setSeatedAtTable: (value: string) => void;
  seatedAtTable: string;
  customTables: Table[];
  defaultTables: Table[];
  showOnlyAvailableTables?: boolean;
  TableComponent: React.FC<TableComponentPropsType>;
  joinMessage: boolean;
  leaveText?: string;
}

export const TablesUserList: React.FC<TablesUserListProps> = ({
  venue,
  setSeatedAtTable,
  seatedAtTable,
  customTables,
  defaultTables,
  showOnlyAvailableTables = false,
  TableComponent,
  joinMessage,
}) => {
  const venueName = venue.name;

  // NOTE: custom tables can already contain default tables and this check here is to only doubleconfrim the data coming from the above
  const tables = customTables || defaultTables;

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

  const usersAtTableReducer = useCallback(
    (obj: Record<string, WithId<User>[]>, table: Table) => ({
      ...obj,
      [table.reference]: recentVenueUsers.filter(
        (user: User) =>
          getUserExperience(venueName)(user)?.table === table.reference
      ),
    }),
    [recentVenueUsers, venueName]
  );

  const usersSeatedAtTables = useMemo(
    () => tables.reduce(usersAtTableReducer, {}),
    [tables, usersAtTableReducer]
  );

  const isFullTable = useCallback(
    (table: Table) => {
      const numberOfSeatsLeft =
        table.capacity &&
        table.capacity - usersSeatedAtTables[table.reference].length;
      return numberOfSeatsLeft === 0;
    },
    [usersSeatedAtTables]
  );

  const tableLocked = useCallback(
    (tableReference: string) => {
      // Empty tables are never locked
      if (!usersSeatedAtTables[tableReference].length) return false;

      // Locked state is in the experience record
      return isTruthy(experience?.tables?.[tableReference]?.locked);
    },
    [experience?.tables, usersSeatedAtTables]
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

  const emptyTables = useMemo(
    () =>
      tables.filter((table) => !usersSeatedAtTables[table.reference].length),
    [tables, usersSeatedAtTables]
  );

  const allowCreateEditTable =
    emptyTables.length <= ALLOWED_EMPTY_TABLES_NUMBER && !isSeatedAtTable;

  const renderedTables = useMemo(() => {
    if (isSeatedAtTable) return;

    const tablesToShow = showOnlyAvailableTables
      ? tables.filter(
          (table) => !(isFullTable(table) || tableLocked(table.reference))
        )
      : tables;

    return tablesToShow.map((table: Table, index: number) => (
      <TableComponent
        key={table.reference}
        // @debt provide usersAtTables instead of (experienceName + users) for better perfomance
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
    showOnlyAvailableTables,
    isFullTable,
    venueName,
  ]);

  if (!isRecentVenueUsersLoaded) return <Loading />;

  return (
    <>
      {renderedTables}
      {allowCreateEditTable && (
        <StartTable
          defaultTables={defaultTables}
          newTable={generateTable({ tableNumber: tables.length })}
        />
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
