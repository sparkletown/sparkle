import React from "react";
import { TableComponentPropsType } from "types/Table";
import { User } from "types/User";

const FriendShipTableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  nameOfVideoRoom,
  experienceName,
  imageSize = 35,
  setSelectedUserProfile,
  table,
  tableLocked,
  usersAtTables,
}) => {
  const locked = tableLocked(table.title, usersAtTables);
  const usersSeatedAtTable = users.filter(
    (u: User) =>
      u.data &&
      u.data[experienceName] &&
      u.data[experienceName].table === table.title
  );
  const full = table.capacity && table.capacity === usersSeatedAtTable.length;
  return (
    <>
      <div
        style={{
          gridColumn: table.columns,
          gridRow: table.rows,
        }}
      >
        <div className="table-title">{table.title}</div>
        {table.subtitle && (
          <div className="table-subtitle">{table.subtitle}</div>
        )}
        <div className="table-item">
          <div
            className={`table-occupancy-information ${
              locked || full ? "red-text" : ""
            }`}
          >
            {locked ? (
              "Locked"
            ) : full ? (
              "Full"
            ) : (
              <div
                className="join-text"
                onClick={() =>
                  onJoinClicked(table.title, locked, nameOfVideoRoom)
                }
              >
                Join
              </div>
            )}
          </div>
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
            [
              ...Array(table.capacity - usersSeatedAtTable.length),
            ].map((e, i) => (
              <span
                onClick={() =>
                  onJoinClicked(table.title, locked, nameOfVideoRoom)
                }
                className="add-participant-button"
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default FriendShipTableComponent;
