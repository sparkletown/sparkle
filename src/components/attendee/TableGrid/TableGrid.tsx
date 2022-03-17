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

import { ButtonNG } from "components/atoms/ButtonNG";

import { TableComponent } from "../TableComponent";

import styles from "./TableGrid.module.scss";

interface TableGridProps {
  customTables: Table[];
  defaultTables: Table[];
  showOnlyAvailableTables?: boolean;
  joinMessage: boolean;
  leaveText?: string;
  space: WithId<AnyVenue>;
  user: WithId<User>;
}

export interface TableSeatData {
  tableReference: string;
}

const generateHuddleId = (spaceId: string, tableReference: string) =>
  `${spaceId}-${tableReference}`;

export const TableGrid: React.FC<TableGridProps> = ({
  customTables,
  defaultTables,
  showOnlyAvailableTables = false,
  joinMessage,
  space,
  user,
}) => {
  const analytics = useAnalytics({ venue: space });

  const [joiningTable, setJoiningTable] = useState<string>();

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

  const isSeatedAtTable = !!takenSeat;

  useEffect(() => {
    takenSeat && analytics.trackSelectTableEvent();
  }, [analytics, takenSeat]);

  const { joinHuddle, leaveHuddle, inHuddle } = useVideoHuddle();

  // Track the previous huddle ID so that we know when someone is leaving
  // a huddle by clicking the "leave huddle" button as this should trigger
  // leaving the seat too.
  const [prevHuddleId, setPrevHuddleId] = useState<string>();

  // @debt
  // Breaking this up into multiple effect hooks might make this less likely
  // to break. There is still the occasional warning from the twilio
  // implementation that the user is attempting to join a huddle without
  // disconnecting first.
  // It might also be a lot cleaner if we stopped dropping people into calls
  // when they refresh their browser
  useEffect(() => {
    // We allow the database to drive what seat we're in and derive the huddle
    // we're in. This gives us a few scenarios that we have to cope with:
    //  1. User going from no seat to a specific seat
    //  2. User moving between seats
    //  3. User leaving their seat
    //  4. The user has left the huddle and needs to leave their seat too
    // Each of these require a bit of logic to make them happen
    if (isSeatedAtTable && !inHuddle) {
      const expectedHuddleId = generateHuddleId(
        space.id,
        takenSeat.seatData.tableReference
      );

      if (prevHuddleId === expectedHuddleId) {
        // Scenario 4
        leaveSeat();
      } else {
        // Scenario 1
        joinHuddle(user.id, expectedHuddleId);
      }
    } else if (isSeatedAtTable && inHuddle) {
      // If the huddle ID doesn't match what we expect then the user has changed
      // seat. This is scenario 2. Leave the huddle and then this hook will get
      // called later and fall into scenario 1
      const expectedHuddleId = generateHuddleId(
        space.id,
        takenSeat.seatData.tableReference
      );
      if (inHuddle !== expectedHuddleId) {
        leaveHuddle();
      }
    } else if (!isSeatedAtTable && inHuddle) {
      // Scenario 3
      leaveHuddle();
    }
    setPrevHuddleId(inHuddle);
  }, [
    // Take care when modifying these. This effect should not be recalculated
    // except when state has -actually- changed and not just because a new
    // object has been created.
    inHuddle,
    isSeatedAtTable,
    joinHuddle,
    leaveHuddle,
    leaveSeat,
    prevHuddleId,
    space.id,
    takenSeat?.seatData.tableReference,
    user.id,
  ]);

  useEffect(() => {
    // Ensure the user leaves their seat and the huddle if they are leaving the
    // space
    return () => {
      leaveSeat();
      leaveHuddle();
    };
  }, [leaveHuddle, leaveSeat]);

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

  const onAcceptJoinMessage = useCallback(
    async (table?: string) => {
      if (!table) {
        return;
      }
      window.scrollTo(0, 0);
      hideJoinMessage();
      await takeSeat({ tableReference: table });
    },
    [hideJoinMessage, takeSeat]
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
