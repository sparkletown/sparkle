import React, { useCallback } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { JAZZBAR_TABLES } from "components/venues/Jazzbar/JazzTab/constants";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { User } from "types/User";

const TableHeader = ({ seatedAtTable, setSeatedAtTable, venueName }: any) => {
  const { experience, user, users } = useSelector((state: any) => ({
    experience:
      state.firestore.data.experiences &&
      state.firestore.data.experiences[venueName],
    user: state.user,
    users: state.firestore.ordered.partygoers,
  }));
  useFirestoreConnect({
    collection: "experiences",
    doc: venueName,
  });

  const tableOfUser =
    seatedAtTable &&
    JAZZBAR_TABLES.find((table) => table.reference === seatedAtTable);

  const usersAtCurrentTable =
    seatedAtTable &&
    users &&
    users.filter(
      (user: User) => user.data?.[venueName]?.table === seatedAtTable
    );

  const firestoreUpdate = (doc: string, update: any) => {
    const firestore = firebase.firestore();
    firestore
      .doc(doc)
      .update(update)
      .catch((e) => {
        firestore.doc(doc).set(update);
      });
  };

  window.onbeforeunload = () => leaveSeat();

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

  // useWindowUnloadEffect(() => leaveSeat(), true);

  const leaveSeat = useCallback(async () => {
    const doc = `users/${user.uid}`;
    const existingData = user.data;
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
  }, [user, setSeatedAtTable, venueName]);

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
