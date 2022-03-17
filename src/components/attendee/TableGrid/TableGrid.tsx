import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useVideoHuddle } from "components/attendee/VideoHuddle/useVideoHuddle";
import { groupBy } from "lodash";

import { ALLOWED_EMPTY_TABLES_NUMBER } from "settings";

import { Table } from "types/Table";
import { SeatedUser, User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { generateTable } from "utils/table";
import { arrayIncludes, isTruthy } from "utils/types";

import { useAnalytics } from "hooks/useAnalytics";
import { useExperience } from "hooks/useExperience";
import { useSeating } from "hooks/useSeating";
import { useShowHide } from "hooks/useShowHide";

import { Loading } from "components/molecules/Loading";
import { Modal } from "components/molecules/Modal";
import { StartTable } from "components/molecules/StartTable";

import { TableComponent } from "../TableComponent";

import styles from "./TableGrid.module.scss";

interface TableGridProps {
  customTables: Table[];
  defaultTables: Table[];
  showOnlyAvailableTables?: boolean;
  leaveText?: string;
  space: WithId<AnyVenue>;
  user: WithId<User>;
}

export interface TableSeatData {
  tableReference: string;
}

// The component is in the first load state
const SEATED_STATUS_FIRST_LOAD = "first-load";
// The user is in the process of taking a seat
// This includes moving from one seat to another
const SEATED_STATUS_TAKING_SEAT = "taking-seat";
// The user is in the process of leaving a seat
const SEATED_STATUS_LEAVING_SEAT = "leaving-seat";
// The user is sat at a seat with nothing changing
const SEATED_STATUS_SAT = "sat";
// The user is not sat anywhere
const SEATED_STATUS_NOT_SAT = "not-sat";

type SeatedStatus =
  | typeof SEATED_STATUS_FIRST_LOAD
  | typeof SEATED_STATUS_TAKING_SEAT
  | typeof SEATED_STATUS_LEAVING_SEAT
  | typeof SEATED_STATUS_SAT
  | typeof SEATED_STATUS_NOT_SAT;

const generateHuddleId = (spaceId: string, tableReference: string) =>
  `${spaceId}-${tableReference}`;

export const TableGrid: React.FC<TableGridProps> = ({
  customTables,
  defaultTables,
  showOnlyAvailableTables = false,
  space,
  user,
}) => {
  const analytics = useAnalytics({ venue: space });

  const [seatedStatus, setSeatedStatus] = useState<SeatedStatus>(
    SEATED_STATUS_FIRST_LOAD
  );
  const { joinHuddle, leaveHuddle, inHuddle } = useVideoHuddle();
  const [desiredTable, setDesiredTable] = useState<string>();

  const {
    takeSeat,
    leaveSeat,
    takenSeat,
    seatedUsers,
    isSeatedUsersLoaded,
  } = useSeating<TableSeatData>({
    user,
    worldId: space.worldId,
    spaceId: space.id,
  });

  // This logging can be removed (or bumped to trace level) when we are happy
  // that seating works properly
  console.log(
    `Seated status [${seatedStatus}]` +
      ` Huddle ID [${inHuddle}]` +
      ` Taken seat [${JSON.stringify(takenSeat)}]` +
      ` Seats loaded [${isSeatedUsersLoaded}]`
  );

  // The logic below deals with all the various transitions that are possible
  // when attempting to reconcile the user's interactions with data from the
  // database (e.g. timing out seats)

  // Seated status is deliberately not restored from the database on first load.
  // This is because a number of browsers will only enable audio if the user
  // interacts with the site first. Placing the user straight into an audio
  // call can result in them not being able to hear anything.
  // When seating data is first loaded, decide if any old seating records
  // should be
  useEffect(() => {
    if (isSeatedUsersLoaded && seatedStatus === SEATED_STATUS_FIRST_LOAD) {
      if (takenSeat) {
        // Remove the user from the seat that they were in
        console.log("First load: cleaning old seating record");
        setSeatedStatus(() => SEATED_STATUS_LEAVING_SEAT);
        leaveSeat();
      } else {
        console.log("First load: not sat");
        setSeatedStatus(() => SEATED_STATUS_NOT_SAT);
      }
    }
  }, [isSeatedUsersLoaded, leaveSeat, seatedStatus, takenSeat]);

  // If the user is sat and has no huddle then they have left the huddle and so
  // should be updated to leaving their seat
  useEffect(() => {
    if (seatedStatus === SEATED_STATUS_SAT && !inHuddle) {
      console.log("Left huddle: leaving seat");
      setSeatedStatus(() => SEATED_STATUS_LEAVING_SEAT);
      leaveSeat();
    }
  }, [seatedStatus, inHuddle, leaveSeat]);

  // If the user is leaving their seat and still in a huddle then they should
  // be removed from it
  useEffect(() => {
    if (seatedStatus === SEATED_STATUS_LEAVING_SEAT && inHuddle) {
      console.log("Leaving seat: leaving huddle");
      leaveHuddle();
    }
  }, [inHuddle, leaveHuddle, seatedStatus]);

  // If the user is leaving their seat and still at their seat then the db
  // needs updating
  useEffect(() => {
    if (seatedStatus === SEATED_STATUS_LEAVING_SEAT && takenSeat) {
      console.log("Leaving seat: removing database records");
      leaveSeat();
    }
  }, [leaveSeat, seatedStatus, takenSeat]);

  // If the user is leaving their seat and they aren't in a seat or a huddle
  // then they can be moved to the not sat state
  useEffect(() => {
    if (
      seatedStatus === SEATED_STATUS_LEAVING_SEAT &&
      !inHuddle &&
      !takenSeat
    ) {
      console.log("Leaving seat: moving to not sat status");
      setSeatedStatus(() => SEATED_STATUS_NOT_SAT);
    }
  }, [inHuddle, seatedStatus, takenSeat]);

  // If the user is taking a seat then make sure the database is in sync
  useEffect(() => {
    if (seatedStatus === SEATED_STATUS_TAKING_SEAT && desiredTable) {
      // This logic covers both moving between seats and taking a brand new one
      const dbTableReference = takenSeat?.seatData.tableReference;
      if (desiredTable !== dbTableReference) {
        console.log("Taking seat: updating database records");
        takeSeat({ tableReference: desiredTable });
      }
    }
  }, [
    desiredTable,
    seatedStatus,
    takeSeat,
    takenSeat?.seatData.tableReference,
  ]);

  // If the user is taking a seat then make sure they're in the right huddle
  useEffect(() => {
    if (seatedStatus === SEATED_STATUS_TAKING_SEAT && desiredTable) {
      const desiredHuddleId = generateHuddleId(space.id, desiredTable);
      // If already in a huddle then leave it first and allow this hook to
      // be invoked again later when the huddle has been left
      if (inHuddle && inHuddle !== desiredHuddleId) {
        console.log("Taking seat: leaving previous huddle");
        leaveHuddle();
        return;
      }

      // If not already in a huddle then join it
      if (!inHuddle) {
        console.log("Taking seat: joining huddle");
        joinHuddle(user.id, desiredHuddleId);
      }
    }
  }, [
    desiredTable,
    inHuddle,
    joinHuddle,
    leaveHuddle,
    seatedStatus,
    space.id,
    user.id,
  ]);

  // If the user is sat and the database record no longer exists then they have
  // been timed out and the component should update accordingly.
  useEffect(() => {
    if (seatedStatus === SEATED_STATUS_SAT && !takenSeat) {
      console.log("Seat timed out: leaving seat");
      setSeatedStatus(() => SEATED_STATUS_LEAVING_SEAT);
    }
  }, [seatedStatus, inHuddle, leaveSeat, takenSeat]);

  // If the user is taking a seat and everything is in the right state then
  // they can be updated to the "sat" status
  useEffect(() => {
    if (seatedStatus === SEATED_STATUS_TAKING_SEAT && desiredTable) {
      const desiredHuddleId = generateHuddleId(space.id, desiredTable);
      const dbTableReference = takenSeat?.seatData.tableReference;
      if (inHuddle === desiredHuddleId && dbTableReference === desiredTable) {
        console.log("Taking seat: sat");
        setSeatedStatus(() => SEATED_STATUS_SAT);
        analytics.trackSelectTableEvent();
      }
    }
  }, [
    analytics,
    desiredTable,
    inHuddle,
    seatedStatus,
    space.id,
    takenSeat?.seatData.tableReference,
  ]);

  // NOTE: custom tables can already contain default tables and this check here is to only doubleconfrim the data coming from the above
  const tables: Table[] = customTables || defaultTables;

  const {
    isShown: isLockedMessageVisible,
    show: showLockedMessage,
    hide: hideLockedMessage,
  } = useShowHide(false);

  const { data: experience } = useExperience();

  const isCurrentUserAdmin = arrayIncludes(space.owners, user.id);

  const usersSeatedAtTables: Record<
    string,
    WithId<SeatedUser<TableSeatData>>[]
  > = useMemo(() => {
    if (!isSeatedUsersLoaded) {
      return {};
    }
    const tableReferences = tables.map((t) => t.reference);

    const filteredUsers = seatedUsers.filter((user) =>
      tableReferences.includes(user.seatData.tableReference)
    );
    return groupBy(filteredUsers, (user) => user.seatData.tableReference);
  }, [isSeatedUsersLoaded, seatedUsers, tables]);

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

  const onJoinClicked = useCallback(
    (table: string, locked: boolean) => {
      if (locked) {
        showLockedMessage();
      } else {
        console.log("Setting desired table", table);
        setDesiredTable(table);
        window.scrollTo(0, 0);
        console.log("Starting to take seat");
        setSeatedStatus(SEATED_STATUS_TAKING_SEAT);
      }
    },
    [showLockedMessage]
  );

  const emptyTables = useMemo(
    () =>
      tables.filter((table) => !usersSeatedAtTables?.[table.reference]?.length),
    [tables, usersSeatedAtTables]
  );

  const allowCreateEditTable =
    seatedStatus === SEATED_STATUS_NOT_SAT &&
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
        space={space}
        userId={user.id}
      />
    ));
  }, [
    showOnlyAvailableTables,
    tables,
    isFullTable,
    tableLocked,
    usersSeatedAtTables,
    onJoinClicked,
    space,
    user.id,
  ]);

  if (!isSeatedUsersLoaded) return <Loading />;

  return (
    <>
      <div className={styles.tableGrid}>{renderedTables}</div>
      {allowCreateEditTable && (
        <StartTable
          defaultTables={defaultTables}
          newTable={generateTable({
            tableNumber: tables.length + 1,
          })}
          venue={space}
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
    </>
  );
};
