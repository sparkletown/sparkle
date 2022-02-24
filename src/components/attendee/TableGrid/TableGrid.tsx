import React, { useCallback, useEffect, useMemo, useState } from "react";
import { groupBy } from "lodash";

import { ALLOWED_EMPTY_TABLES_NUMBER } from "settings";

import { setTableSeat, unsetTableSeat } from "api/venue";

import { Table } from "types/Table";
import { TableSeatedUser } from "types/User";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId } from "utils/id";
import { generateTable } from "utils/table";
import { arrayIncludes, isTruthy } from "utils/types";

import { useAnalytics } from "hooks/useAnalytics";
import { useExperience } from "hooks/useExperience";
import { useSeatedTableUsers } from "hooks/useSeatedTableUsers";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateTableRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";
import { useUser } from "hooks/useUser";

import { ButtonNG } from "components/atoms/ButtonNG";
import { useVideoHuddle } from "components/attendee/VideoHuddle/useVideoHuddle";
import { Loading } from "components/molecules/Loading";
import { Modal } from "components/molecules/Modal";
import { StartTable } from "components/molecules/StartTable";

import { TableComponent } from "../TableComponent";

import styles from "./TableGrid.module.scss";

interface TableGridProps {
  customTables: Table[];
  defaultTables: Table[];
  showOnlyAvailableTables?: boolean;
  joinMessage: boolean;
  leaveText?: string;
  venue: WithId<AnyVenue>;
  venueId: string;
  userId: string;
}

export const TableGrid: React.FC<TableGridProps> = ({
  venueId,
  customTables,
  defaultTables,
  showOnlyAvailableTables = false,
  joinMessage,
  venue,
  userId,
}) => {
  const analytics = useAnalytics({ venue });
  const [seatedAtTable, setSeatedAtTable] = useState<string>();

  useUpdateTableRecentSeatedUsers(
    VenueTemplate.jazzbar,
    seatedAtTable && venue?.id
  );

  useEffect(() => {
    seatedAtTable && analytics.trackSelectTableEvent();
  }, [analytics, seatedAtTable]);

  const { joinHuddle, leaveHuddle, inHuddle } = useVideoHuddle();

  const wasPrevAtTable = !!seatedAtTable;
  const joinTable = useCallback(
    (table) => {
      // If the user is already in a huddle and was previously at another
      // table then make sure to leave the huddle first. This covers the
      // scenario where a user clicks "join" when already at a different
      // table
      if (wasPrevAtTable && table) {
        leaveHuddle();
      }
      joinHuddle(userId, `${venue.id}-${table}`);
      setSeatedAtTable(table);
    },
    [wasPrevAtTable, joinHuddle, userId, venue.id, leaveHuddle]
  );

  const leaveTable = useCallback(async () => {
    await unsetTableSeat(userId, { venueId: venue.id });
    setSeatedAtTable(undefined);
  }, [userId, venue.id]);

  useEffect(() => {
    if (!inHuddle && seatedAtTable) {
      leaveTable();
    }
  }, [inHuddle, leaveTable, seatedAtTable]);

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

  const { userWithId } = useUser();
  const { data: experience } = useExperience();

  const isCurrentUserAdmin = arrayIncludes(venue.owners, userId);

  const [seatedTableUsers, isSeatedTableUsersLoaded] = useSeatedTableUsers(
    venueId
  );

  const userTableReference = useMemo(
    () =>
      seatedTableUsers.find((u) => u.id === userWithId?.id)?.path
        ?.tableReference,
    [seatedTableUsers, userWithId?.id]
  );

  useEffect(() => {
    if (userTableReference && userTableReference !== seatedAtTable) {
      joinTable(userTableReference);
    }
  }, [joinTable, userTableReference, seatedAtTable]);

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
        userId={userId}
      />
    ));
  }, [
    showOnlyAvailableTables,
    tables,
    isFullTable,
    tableLocked,
    usersSeatedAtTables,
    onJoinClicked,
    venue,
    userId,
  ]);

  if (!isSeatedTableUsersLoaded) return <Loading />;

  return (
    <>
      <div className={styles.tableGrid}>{renderedTables}</div>
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
        <div>
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
        <div>
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
