import React, { useCallback, useEffect, useMemo } from "react";
import firebase from "firebase/app";
import { User } from "types/User";
import { usePartygoers } from "hooks/users";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { Table } from "types/Table";
import { experiencesSelector } from "utils/selectors";

interface TableHeaderProps {
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

  const experiences = useSelector(experiencesSelector);
  const users = usePartygoers();

  const tableOfUser = seatedAtTable
    ? tables.find((table) => table.reference === seatedAtTable)
    : undefined;

  const usersAtCurrentTable = useMemo(
    () =>
      seatedAtTable &&
      users.filter(
        (user: User) => user.data?.[venueName]?.table === seatedAtTable
      ),
    [seatedAtTable, users, venueName]
  );

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
    return experiences?.[venueName]?.tables?.[table]?.locked;
  };

  const onLockedChanged = (tableName: string, locked: boolean) => {
    const doc = `experiences/${venueName}`;
    const update = {
      tables: { ...experiences?.[venueName]?.tables, [tableName]: { locked } },
    };
    firestoreUpdate(doc, update);
  };

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
    <div className="row no-margin at-table table-header">
      <div className="header" style={{ marginRight: "60px" }}>
        <div className="back-button-container">
          <button
            type="button"
            title={"Leave " + seatedAtTable}
            className="btn btn-primary back-button"
            id="leave-seat"
            onClick={leaveSeat}
          >
            Back
          </button>
        </div>
        <div className="table-title-container">
          <div className="private-table-title" style={{ fontSize: "20px" }}>
            {tableOfUser?.title ?? "abc" /*seatedAtTable*/}
            {tableOfUser && tableOfUser.capacity && (
              <>
                {" "}
                <span style={{ fontSize: "12px" }}>
                  {usersAtCurrentTable &&
                    `${
                      tableOfUser.capacity - usersAtCurrentTable.length >= 1
                        ? tableOfUser.capacity - usersAtCurrentTable.length
                        : 0
                    } seats left`}
                </span>
              </>
            )}
          </div>
          {tableOfUser && tableOfUser.subtitle && (
            <div className="private-table-subtitle">{tableOfUser.subtitle}</div>
          )}
        </div>
        <div className="lock-button-container">
          <div className="lock-table-checbox-indication">
            {!!tableLocked(seatedAtTable) ? (
              <p className="locked-text">Table is locked</p>
            ) : (
              <p className="unlocked-text">Others can join this table</p>
            )}
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={!!tableLocked(seatedAtTable)}
              onChange={() =>
                onLockedChanged(seatedAtTable, !tableLocked(seatedAtTable))
              }
            />
            <span className="slider" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
