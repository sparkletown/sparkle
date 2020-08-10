import React, { useCallback, useEffect } from "react";
import { JAZZBAR_TABLES } from "components/templates/Jazzbar/JazzTab/constants";
import firebase from "firebase/app";
import { User } from "types/User";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";

interface TableHeaderProps {
  seatedAtTable: string;
  setSeatedAtTable: (val: string) => void;
  venueName: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  seatedAtTable,
  setSeatedAtTable,
  venueName,
}) => {
  const { user, profile } = useUser();
  const { experience, users } = useSelector((state) => ({
    experience:
      state.firestore.data.experiences &&
      state.firestore.data.experiences[venueName],
    users: state.firestore.ordered.partygoers,
  }));

  const tableOfUser = seatedAtTable
    ? JAZZBAR_TABLES.find((table) => table.reference === seatedAtTable)
    : undefined;

  const usersAtCurrentTable =
    seatedAtTable &&
    users &&
    users.filter(
      (user: User) => user.data?.[venueName]?.table === seatedAtTable
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

  useEffect(() => {
    window.addEventListener("onbeforeunload", () => leaveSeat());
  });

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
    return experience?.tables?.[table]?.locked;
  };

  const onLockedChanged = (tableName: string, locked: boolean) => {
    const doc = `experiences/${venueName}`;
    const update = {
      tables: { ...experience?.tables, [tableName]: { locked } },
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

  return (
    <div className="row no-margin at-table table-header">
      <div className="header" style={{ marginRight: "60px" }}>
        <div className="action">
          <button
            type="button"
            title={"Leave " + seatedAtTable}
            className="btn back-button"
            id="leave-seat"
            onClick={leaveSeat}
          >
            Back
          </button>
        </div>
        <div className="table-title-container">
          <div className="private-table-title" style={{ fontSize: "20px" }}>
            {tableOfUser?.title || seatedAtTable}
            {tableOfUser && tableOfUser.capacity && (
              <>
                {" "}
                <span style={{ fontSize: "12px" }}>
                  (
                  {usersAtCurrentTable &&
                    `${tableOfUser.capacity - usersAtCurrentTable.length}`}{" "}
                  seats left )
                </span>
              </>
            )}
          </div>
          {tableOfUser && tableOfUser.subtitle && (
            <div className="private-table-subtitle">{tableOfUser.subtitle}</div>
          )}
        </div>
        <div className="action">
          <label className="switch">
            <input
              type="checkbox"
              checked={!tableLocked(seatedAtTable)}
              onChange={() =>
                onLockedChanged(seatedAtTable, !tableLocked(seatedAtTable))
              }
            />
            <span className="slider" />
          </label>
          <div className="lock-table-checbox-indication">
            {tableLocked(seatedAtTable) ? (
              <p className="locked-text">Table is locked</p>
            ) : (
              <p className="unlocked-text">Others can join this table</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
