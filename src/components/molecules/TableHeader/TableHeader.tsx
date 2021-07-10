import React, { useCallback, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faLockOpen,
  faChevronLeft,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/app";

import { MAX_TABLE_CAPACITY } from "settings";

import { User } from "types/User";
import { Table } from "types/Table";

import { useRecentVenueUsers } from "hooks/users";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";

import { experienceSelector } from "utils/selectors";
import { isTruthy } from "utils/types";

import { Toggler } from "components/atoms/Toggler";

import { EditTableTitleModal } from "./components/EditTableTitleModal";

import "./TableHeader.scss";

export interface TableHeaderProps {
  seatedAtTable: string;
  setSeatedAtTable: (val: string) => void;
  venueName: string;
  tables: Table[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  seatedAtTable,
  setSeatedAtTable,
  venueName,
  tables,
}) => {
  const { user, profile } = useUser();

  const { tables: allTables } = useSelector(experienceSelector) ?? {};
  const { recentVenueUsers } = useRecentVenueUsers({ venueName });
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

  const currentTableHasSeatedUsers = useMemo(
    () =>
      !!recentVenueUsers.find(
        (user: User) => user.data?.[venueName]?.table === seatedAtTable
      ),
    [venueName, recentVenueUsers, seatedAtTable]
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
      firestoreUpdate(doc, update);
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
    recentVenueUsers,
    seatedAtTable,
    isCurrentTableLocked,
    currentTableHasSeatedUsers,
    setIsCurrentTableLocked,
  ]);

  // @debt This should be extracted into the api layer
  const leaveSeat = useCallback(async () => {
    if (!user || !profile) return;

    const doc = `users/${user.uid}`;
    const existingData = profile.data;
    const update = {
      data: {
        ...existingData,
        [venueName]: {
          table: null,
          videoRoom: null,
        },
      },
    };
    await firestoreUpdate(doc, update);

    setSeatedAtTable("");
  }, [user, profile, venueName, setSeatedAtTable]);

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
          defaultChecked={isCurrentTableLocked}
          onChange={toggleIsCurrentTableLocked}
        />
      </div>

      <EditTableTitleModal
        title={tableTitle}
        subtitle={tableSubtitle}
        capacity={tableCapacity}
        onHide={hide}
        {...{ isShown, tables, tableOfUser }}
      />
    </div>
  );
};

export default TableHeader;
