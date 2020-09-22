import React from "react";
import { TableComponentPropsType } from "types/Table";
import "./TableComponent.scss";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { useSelector } from "hooks/useSelector";

const TableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  nameOfVideoRoom,
  experienceName,
  imageSize = 50,
  setSelectedUserProfile,
  table,
  tableLocked,
}) => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));
  const locked = tableLocked(table.reference);
  const usersSeatedAtTable = users.filter(
    (u) => u.data?.[experienceName]?.table === table.reference
  );
  const numberOfSeatsLeft =
    table.capacity && table.capacity - usersSeatedAtTable.length;
  const full = numberOfSeatsLeft === 0;
  return (
    <div className={`table-component-container ${table.reference}`}>
      <div
        className="table-item"
        style={{
          height: `${table.rows && table.rows * 50 + 65}px`,
          width: `${table.columns && (table.columns + 1) * 55}px`,
        }}
      >
        <div className="table-occupancy-information red-text">
          {locked ? "locked" : full ? "full" : ""}
        </div>
        <div className="table-number">{table.title}</div>

        {usersSeatedAtTable &&
          usersSeatedAtTable.length >= 0 &&
          usersSeatedAtTable.map(
            (user) =>
              !user.anonMode && (
                <img
                  onClick={() => setSelectedUserProfile(user)}
                  key={user.id}
                  className="profile-icon table-participant-picture"
                  src={user.pictureUrl || DEFAULT_PROFILE_IMAGE}
                  title={user.partyName}
                  alt={`${user.partyName} profile`}
                  width={imageSize}
                  height={imageSize}
                />
              )
          )}
        {usersSeatedAtTable &&
          table.capacity &&
          table.capacity - usersSeatedAtTable.length >= 0 &&
          [...Array(table.capacity - usersSeatedAtTable.length)].map((e, i) => (
            <span
              key={i}
              onClick={() =>
                onJoinClicked(table.reference, locked, nameOfVideoRoom)
              }
              id={`join-table-${venue?.name}-${table.reference}`}
              className="add-participant-button"
            >
              +
            </span>
          ))}
      </div>
    </div>
  );
};

export default TableComponent;
