import React, { useCallback, useEffect, useMemo, useState } from "react";
import { groupBy } from "lodash";

import { ALLOWED_EMPTY_TABLES_NUMBER } from "settings";

import { setTableSeat } from "api/venue";

import { Table, TableComponentPropsType } from "types/Table";
import { TableSeatedUser, User } from "types/User";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId } from "utils/id";
import { generateTable } from "utils/table";
import { arrayIncludes, isTruthy } from "utils/types";

import { useExperience } from "hooks/useExperience";
import { useSeatedTableUsers } from "hooks/useSeatedTableUsers";
import { useShowHide } from "hooks/useShowHide";

import { Loading } from "components/molecules/Loading";
import { Modal } from "components/molecules/Modal";
import { StartTable } from "components/molecules/StartTable";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./TablesUserList.scss";

export interface TablesUserListProps {
  setSeatedAtTable: (value: string) => void;
  seatedAtTable: string | undefined;
  customTables: Table[];
  defaultTables: Table[];
  showOnlyAvailableTables?: boolean;
  TableComponent: React.FC<TableComponentPropsType>;
  joinMessage: boolean;
  leaveText?: string;
  venue: WithId<AnyVenue>;
  venueId: string;
  template: VenueTemplate;
  user: WithId<User>;
}

export const TablesUserList: React.FC<TablesUserListProps> = ({
  venueId,
  setSeatedAtTable,
  seatedAtTable,
  customTables,
  defaultTables,
  showOnlyAvailableTables = false,
  TableComponent,
  joinMessage,
  venue,
  template,
  user,
}) => {
  // NOTE: custom tables can already contain default tables and this check here is to only doubleconfrim the data coming from the above
  const tables: Table[] = customTables || defaultTables;

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

  const { data: experience } = useExperience();

  const isCurrentUserAdmin = arrayIncludes(venue.owners, user.id);

  const [seatedTableUsers, isSeatedTableUsersLoaded] = useSeatedTableUsers(
    venueId
  );

  const userTableReference = seatedTableUsers.find((u) => u.id === user.id)
    ?.path?.tableReference;

  useEffect(() => {
    if (userTableReference) {
      setSeatedAtTable(userTableReference);
    }
  }, [setSeatedAtTable, userTableReference]);

  const isSeatedAtTable = !!seatedAtTable;

  const takeSeat = useCallback(
    async (table: string) => {
      await setTableSeat(user, {
        venueId,
        tableReference: table,
      });
    },
    [user, venueId]
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

  const allowCreateEditTable =
    !isSeatedAtTable &&
    (isCurrentUserAdmin || emptyTables.length <= ALLOWED_EMPTY_TABLES_NUMBER);

  const renderedTables = useMemo(() => {
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
        userId={user.id}
      />
    ));
  }, [
    showOnlyAvailableTables,
    tables,
    isFullTable,
    tableLocked,
    TableComponent,
    usersSeatedAtTables,
    onJoinClicked,
    venue,
    user.id,
  ]);

  if (!isSeatedTableUsersLoaded) return <Loading />;

  return (
    <>
      <div className="TablesUserList">{renderedTables}</div>
      {allowCreateEditTable && (
        <StartTable
          defaultTables={defaultTables}
          newTable={generateTable({
            tableNumber: tables.length + 1,
          })}
          venue={venue}
        />
      )}
      <Modal show={isLockedMessageVisible} onHide={hideLockedMessage}>
        <div className="TableUserList__modal modal-container modal-container_message">
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
      </Modal>

      <Modal
        show={isJoinMessageVisible}
        onHide={hideJoinMessage}
        autoHide={false}
      >
        <div className="TableUserList__modal modal-container modal-container_message">
          <p>
            You are now entering a video chat space. Please ALLOW camera &
            microphone access. You will be able to turn them back off again once
            inside, should you choose to do so. To avoid feedback from the
            music, we recommend wearing headphones.
          </p>

          <p>You can also adjust the volume on the live stream.</p>

          <ButtonNG onClick={acceptJoiningTable} variant="primary">
            OK
          </ButtonNG>
        </div>
      </Modal>
    </>
  );
};
