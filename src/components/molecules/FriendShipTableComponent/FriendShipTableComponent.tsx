import React from "react";
import { TableComponentPropsType } from "types/Table";
import { User } from "types/User";
import "./FriendShipTableComponent.scss";

const FriendShipTableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  nameOfVideoRoom,
  experienceName,
  imageSize = 50,
  setSelectedUserProfile,
  table,
  tableLocked,
}) => {
  const locked = tableLocked(table.reference);
  const usersSeatedAtTable = users.filter(
    (u: User) => u.data?.[experienceName]?.table === table.reference
  );
  const numberOfSeatsLeft =
    table.capacity && table.capacity - usersSeatedAtTable.length;
  const full = numberOfSeatsLeft === 0;
  return (
    <div className="table-component-container">
      <div className="table-title-container">
        {table.title && <div className="table-title">{table.title}</div>}
        {table.subtitle && (
          <div className="table-subtitle">{table.subtitle}</div>
        )}
      </div>
      <div
        className="table-item"
        style={{
          height: `${table.rows && table.rows * 50 + 65}px`,
          width: `${table.columns && (table.columns + 1) * 50}px`,
        }}
      >
        <div
          className={`table-occupancy-information ${
            locked || full ? "red-text" : "green-text"
          }`}
        >
          {locked ? (
            "locked"
          ) : full ? (
            "full"
          ) : (
            <div
              className="join-text"
              onClick={() =>
                onJoinClicked(table.reference, locked, nameOfVideoRoom)
              }
            >
              open
            </div>
          )}
        </div>
        {numberOfSeatsLeft && numberOfSeatsLeft > 0 && (
          <div className="remaining-seats">
            {numberOfSeatsLeft} {numberOfSeatsLeft === 1 ? "seat" : "seats"}{" "}
            left
          </div>
        )}

        {usersSeatedAtTable.map((user: User) => (
          <img
            onClick={() => setSelectedUserProfile(user)}
            key={user.id}
            className="profile-icon table-participant-picture"
            src={user.pictureUrl || "/anonymous-profile-icon.jpeg"}
            title={user.partyName}
            alt={`${user.partyName} profile`}
            width={imageSize}
            height={imageSize}
          />
        ))}
        {table.capacity &&
          [...Array(table.capacity - usersSeatedAtTable.length)].map((e, i) => (
            <span
              onClick={() =>
                onJoinClicked(table.reference, locked, nameOfVideoRoom)
              }
              className="add-participant-button"
            >
              +
            </span>
          ))}
      </div>
    </div>
  );
};

export default FriendShipTableComponent;
