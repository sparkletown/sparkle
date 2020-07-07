import React from "react";
import { TableComponentPropsType } from "types/Table";
import { User } from "types/User";
import "./TableComponent.scss";
import { useSelector } from "react-redux";

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
  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
  }));
  const locked = tableLocked(table.reference);
  const usersSeatedAtTable = users.filter(
    (u: User) => u.data?.[experienceName]?.table === table.reference
  );
  const numberOfSeatsLeft =
    table.capacity && table.capacity - usersSeatedAtTable.length;
  const full = numberOfSeatsLeft === 0;
  return (
    <div className={`table-component-container ${table.reference}`}>
      {/* {table.title && (
        <div className="table-title-container">
          <div className="table-title">{table.title}</div>
          {table.subtitle && (
            <div className="table-subtitle">{table.subtitle}</div>
          )}
        </div>
      )} */}
      <div
        className="table-item"
        style={{
          height: `${table.rows && table.rows * 50 + 65}px`,
          width: `${table.columns && (table.columns + 1) * 55}px`,
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
        <div className="table-number">{table.title}</div>

        {usersSeatedAtTable &&
          usersSeatedAtTable.length >= 0 &&
          usersSeatedAtTable.map((user: User) => (
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
        {usersSeatedAtTable &&
          table.capacity &&
          table.capacity - usersSeatedAtTable.length >= 0 &&
          [...Array(table.capacity - usersSeatedAtTable.length)].map((e, i) => (
            <span
              onClick={() =>
                onJoinClicked(table.reference, locked, nameOfVideoRoom)
              }
              id={`join-table-${venue.name}-${table.reference}`}
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
