import React, { useCallback, useEffect, useMemo } from "react";
import firebase from "firebase/app";
import { User } from "types/User";
import { useRecentVenueUsers } from "hooks/users";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { Table } from "types/Table";
import { experienceSelector } from "utils/selectors";

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

  const experience = useSelector(experienceSelector);
  const { recentVenueUsers } = useRecentVenueUsers();

  const allTables = experience?.tables;

  const tableOfUser = seatedAtTable
    ? tables.find((table) => table.reference === seatedAtTable)
    : undefined;

  const usersAtCurrentTable = useMemo(
    () =>
      seatedAtTable &&
      recentVenueUsers.filter(
        (user: User) => user.data?.[venueName]?.table === seatedAtTable
      ),
    [seatedAtTable, recentVenueUsers, venueName]
  );

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

  const isCurrentTableLocked = useMemo(() => {
    // @debt Why does `locked` has Table type?
    return !!allTables?.[seatedAtTable]?.locked;
  }, [allTables, seatedAtTable]);

  const currentTableHasSeatedUsers = useMemo(
    () =>
      recentVenueUsers.filter(
        (user: User) => user.data?.[venueName]?.table === seatedAtTable
      ).length !== 0,
    [venueName, recentVenueUsers, seatedAtTable]
  );

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
      <div className="header">
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
          <div
            className="private-table-title"
            style={{ fontSize: "16px", fontWeight: 700 }}
          >
            {tableOfUser?.title ?? "abc" /*seatedAtTable*/}
            {tableOfUser && tableOfUser.capacity && (
              <>
                {" "}
                <span
                  style={{
                    fontSize: "16px",
                    marginLeft: "20px",
                    fontWeight: 400,
                  }}
                >
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
            {isCurrentTableLocked ? (
              <p className="locked-text">Table is locked</p>
            ) : (
              <p className="unlocked-text">Lock table?</p>
            )}
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={!!isCurrentTableLocked}
              onChange={toggleIsCurrentTableLocked}
            />
            <span className="slider" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
