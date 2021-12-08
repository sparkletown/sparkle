import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { groupBy } from "lodash";

import {
  ALLOWED_EMPTY_TABLES_NUMBER,
  DEFAULT_TABLE_CAPACITY,
  DEFAULT_TABLE_COLUMNS,
  DEFAULT_TABLE_ROWS,
} from "settings";

import { setTableSeat } from "api/venue";

import { Table, TableComponentPropsType } from "types/Table";
import { TableSeatedUser } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { experienceSelector } from "utils/selectors";
import { isTruthy } from "utils/types";

import { useSeatedTableUsers } from "hooks/useSeatedTableUsers";
import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";
import { StartTable } from "components/molecules/StartTable";

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

const defaultTables = [...Array(DEFAULT_TABLE_COUNT)].map((_, i: number) =>
  createTable(i)
);

export interface TablesUserListProps {
  venueId: string;
  setSeatedAtTable: (value: string) => void;
  seatedAtTable: string | undefined;
  customTables: Table[];
  showOnlyAvailableTables?: boolean;
  TableComponent: React.FC<TableComponentPropsType>;
  joinMessage: boolean;
  leaveText?: string;
  venue: WithId<AnyVenue>;
}

export const TablesUserList: React.FC<TablesUserListProps> = ({
  venueId,
  setSeatedAtTable,
  seatedAtTable,
  customTables,
  showOnlyAvailableTables = false,
  TableComponent,
  joinMessage,
  venue,
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

  const { userWithId } = useUser();
  const experience = useSelector(experienceSelector);

  const tables: Table[] = customTables || defaultTables;

  const [seatedTableUsers, isSeatedTableUsersLoaded] = useSeatedTableUsers(
    venueId
  );

  const userTableReference = seatedTableUsers.find(
    (u) => u.id === userWithId?.id
  )?.path?.tableReference;

  useEffect(() => {
    userTableReference
      ? setSeatedAtTable(userTableReference)
      : setSeatedAtTable("");
  }, [setSeatedAtTable, userTableReference]);

  const isSeatedAtTable = !!seatedAtTable;

  const takeSeat = useCallback(
    async (table: string) => {
      if (!userWithId) return;

      await setTableSeat(userWithId, {
        venueId,
        tableReference: table,
      });
    },
    [userWithId, venueId]
  );

  const usersSeatedAtTables: Record<
    string,
    WithId<TableSeatedUser>[]
  > = useMemo(() => {
    const tableReferences = tables.map((t) => t.reference);

    const filteredUsers = seatedTableUsers.filter((user) =>
      tableReferences.includes(user.path.tableReference)
    );
    return groupBy(filteredUsers, (user) => user.path.tableReference);
  }, [seatedTableUsers, tables]);

  const isFullTable = useCallback(
    (table: Table) => {
      const numberOfSeatsLeft =
        table.capacity &&
        table.capacity - (usersSeatedAtTables?.[table.reference]?.length ?? 0);
      return numberOfSeatsLeft === 0;
    },
    [usersSeatedAtTables]
  );

  const tableLocked = useCallback(
    (tableReference: string) => {
      // Empty tables are never locked
      if (!usersSeatedAtTables?.[tableReference]?.length) return false;

      // Locked state is in the experience record
      return isTruthy(experience?.tables?.[tableReference]?.locked);
    },
    [experience?.tables, usersSeatedAtTables]
  );

  const onAcceptJoinMessage = useCallback(
    async (table: string) => {
      window.scrollTo(0, 0);
      hideJoinMessage();
      await takeSeat(table);
      setSeatedAtTable(table);
    },
    [hideJoinMessage, setSeatedAtTable, takeSeat]
  );

  const acceptJoiningTable = useCallback(
    () => onAcceptJoinMessage(joiningTable),
    [joiningTable, onAcceptJoinMessage]
  );

  const onJoinClicked = useCallback(
    (table: string, locked: boolean) => {
      if (locked) {
        showLockedMessage();
      } else {
        setJoiningTable(table);
        joinMessage ? showJoinMessage() : onAcceptJoinMessage(table);
      }
    },
    [joinMessage, onAcceptJoinMessage, showJoinMessage, showLockedMessage]
  );

  const emptyTables = useMemo(
    () =>
      tables.filter((table) => !usersSeatedAtTables?.[table.reference]?.length),
    [tables, usersSeatedAtTables]
  );

  const canStartTable =
    emptyTables.length <= ALLOWED_EMPTY_TABLES_NUMBER && !isSeatedAtTable;

  const renderedTables = useMemo(() => {
    if (isSeatedAtTable) return;

    const tablesToShow = showOnlyAvailableTables
      ? tables.filter(
          (table) => !(isFullTable(table) || tableLocked(table.reference))
        )
      : tables;

    return tablesToShow.map((table: Table) => (
      <TableComponent
        key={table.reference}
        // @debt provide usersAtTables instead of (experienceName + users) for better perfomance
        users={usersSeatedAtTables?.[table.reference] ?? []}
        table={table}
        tableLocked={tableLocked}
        onJoinClicked={onJoinClicked}
        venue={venue}
      />
    ));
  }, [
    isSeatedAtTable,
    showOnlyAvailableTables,
    tables,
    isFullTable,
    tableLocked,
    TableComponent,
    usersSeatedAtTables,
    onJoinClicked,
    venue,
  ]);

  if (!isSeatedTableUsersLoaded) return <Loading />;

  return (
    <>
      {renderedTables}
      {canStartTable && (
        <StartTable
          tables={tables}
          newTable={createTable(tables.length)}
          venue={venue}
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
              You are now entering a video chat space. Please ALLOW camera &
              microphone access. You will be able to turn them back off again
              once inside, should you choose to do so. To avoid feedback from
              the music, we recommend wearing headphones.
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
