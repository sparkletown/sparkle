import React, { useCallback, useEffect, useMemo } from "react";
import {
  faChevronLeft,
  faLock,
  faLockOpen,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableSeatData } from "components/attendee/TableGrid/TableGrid";
import { Toggler } from "components/attendee/Toggler";
import firebase from "firebase/compat/app";

import { MAX_TABLE_CAPACITY } from "settings";

import { unsetSeat } from "api/world";

import { Table } from "types/Table";

import { isTruthy } from "utils/types";

import { useExperience } from "hooks/useExperience";
import { useSeatedUsers } from "hooks/useSeatedUsers";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { EditTableTitleModal } from "./components/EditTableTitleModal";

import "./TableHeader.scss";

export interface TableHeaderProps {
  seatedAtTable: string;
  setSeatedAtTable: (val: string) => void;
  worldId: string;
  venueId: string;
  venueName: string;
  tables: Table[];
  defaultTables: Table[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  seatedAtTable,
  setSeatedAtTable,
  worldId,
  venueId,
  venueName,
  tables,
  defaultTables,
}) => {
  const { userId, profile } = useUser();

  const { tables: allTables } = useExperience(venueName);

  const { isShown, show, hide } = useShowHide();

  const tableOfUser = useMemo(
    () =>
      seatedAtTable
        ? tables.find((table) => table.reference === seatedAtTable)
        : undefined,
    [seatedAtTable, tables]
  );

  // @debt This should be removed after the functions using it, are extracted into the api layer.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firestoreUpdate = async (doc: string, update: any) => {
    const firestore = firebase.firestore();
    await firestore
      .doc(doc)
      .update(update)
      .catch(() => {
        firestore.doc(doc).set(update);
      });
  };

  const isCurrentTableLocked = isTruthy(!!allTables?.[seatedAtTable]?.locked);

  const { users: seatedTableUsers } = useSeatedUsers<TableSeatData>({
    worldId: worldId,
    spaceId: venueId,
  });
  const currentTableHasSeatedUsers = seatedTableUsers.some(
    (user) => user.seatData.tableReference === seatedAtTable
  );

  const tableTitle = tableOfUser?.title ?? "Table";
  const tableCapacity = tableOfUser?.capacity ?? MAX_TABLE_CAPACITY;
  const tableSubtitle = tableOfUser?.subtitle;

  // @debt This should be extracted into the api layer
  const setIsCurrentTableLocked = useCallback(
    (locked: boolean) => {
      const doc = `experiences/${venueName}`;
      const update = {
        tables: { ...allTables, [seatedAtTable]: { locked } },
      };
      void firestoreUpdate(doc, update);
    },
    [venueName, allTables, seatedAtTable]
  );

  const toggleIsCurrentTableLocked = useCallback(
    () => setIsCurrentTableLocked(!isCurrentTableLocked),
    [setIsCurrentTableLocked, isCurrentTableLocked]
  );

  useEffect(() => {
    if (isCurrentTableLocked && !currentTableHasSeatedUsers) {
      setIsCurrentTableLocked(false);
    }
  }, [
    seatedAtTable,
    isCurrentTableLocked,
    currentTableHasSeatedUsers,
    setIsCurrentTableLocked,
  ]);

  // @debt This should be extracted into the api layer
  const leaveSeat = useCallback(async () => {
    if (!userId || !profile) return;
    await unsetSeat({
      userId,
      worldId,
    });
    setSeatedAtTable("");
  }, [userId, profile, worldId, setSeatedAtTable]);

  useEffect(() => {
    window.addEventListener("beforeunload", leaveSeat);
    return () => {
      window.removeEventListener("beforeunload", leaveSeat, false);
    };
  }, [leaveSeat]);

  return (
    <div className="row TableHeader">
      <div className="TableHeader__leave-table">
        <button
          type="button"
          title={`Leave ${seatedAtTable}`}
          className="TableHeader__leave-button"
          onClick={leaveSeat}
        >
          <FontAwesomeIcon
            className="TableHeader__leave-button--icon"
            icon={faChevronLeft}
            size="xs"
          />
          Leave table
        </button>
      </div>

      <div className="TableHeader__topic-info">
        <div className="row TableHeader__topic">
          {tableTitle}

          <div className="TableHeader__edit-topic-button" onClick={show}>
            <FontAwesomeIcon icon={faPen} />
          </div>
        </div>

        {tableCapacity && (
          <span className="TableHeader__table-details">
            {tableOfUser?.subtitle && `${tableOfUser.subtitle} - `}
            {tableCapacity} seats
          </span>
        )}
      </div>

      <div className="TableHeader__lock-button">
        <FontAwesomeIcon
          className="TableHeader__lock-button--icon"
          icon={isCurrentTableLocked ? faLock : faLockOpen}
          size="sm"
        />
        <div className="TableHeader__lock-indication">
          {isCurrentTableLocked ? "Table Locked" : "Lock Table"}
        </div>
        {/* @debt pass the header into Toggler's 'label' prop instead of being external like this */}
        <Toggler
          containerClassName="TableHeader__lock-toggle"
          toggled={isCurrentTableLocked}
          onChange={toggleIsCurrentTableLocked}
        />
      </div>

      <EditTableTitleModal
        title={tableTitle}
        subtitle={tableSubtitle}
        capacity={tableCapacity}
        defaultTables={defaultTables}
        onHide={hide}
        {...{ isShown, tables, tableOfUser }}
      />
    </div>
  );
};
