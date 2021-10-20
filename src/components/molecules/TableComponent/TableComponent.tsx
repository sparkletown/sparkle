import React from "react";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { TableComponentPropsType } from "types/Table";

import { currentVenueSelectorData } from "utils/selectors";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useSelector } from "hooks/useSelector";

import "./TableComponent.scss";

const TableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  nameOfVideoRoom,
  experienceName,
  imageSize = 50,
  table,
  tableLocked,
}) => {
  const { openUserProfileModal } = useProfileModalControls();
  const venue = useSelector(currentVenueSelectorData);
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
          usersSeatedAtTable.map((user) => (
            <img
              onClick={() => openUserProfileModal(user)}
              key={user.id}
              className="profile-icon table-participant-picture"
              src={(!user.anonMode && user.pictureUrl) || DEFAULT_PROFILE_IMAGE}
              title={(!user.anonMode && user.partyName) || DEFAULT_PARTY_NAME}
              alt={`${
                (!user.anonMode && user.partyName) || DEFAULT_PARTY_NAME
              } profile`}
              width={imageSize}
              height={imageSize}
            />
          ))}
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
