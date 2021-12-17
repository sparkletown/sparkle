import React from "react";

import { DEFAULT_PARTY_NAME } from "settings";

import { TableComponentPropsType } from "types/Table";

import { determineAvatar } from "utils/image";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import "./TableComponent.scss";

const TableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  imageSize = 50,
  table,
  tableLocked,
  venue,
}) => {
  const { openUserProfileModal } = useProfileModalControls();
  const locked = tableLocked(table.reference);
  const numberOfSeatsLeft = table.capacity && table.capacity - users.length;
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

        {users &&
          users.length >= 0 &&
          users.map((user) => (
            <img
              onClick={() => openUserProfileModal(user.id)}
              key={user.id}
              className="profile-icon table-participant-picture"
              src={determineAvatar({ user })}
              title={(!user.anonMode && user.partyName) || DEFAULT_PARTY_NAME}
              alt={`${
                (!user.anonMode && user.partyName) || DEFAULT_PARTY_NAME
              } profile`}
              width={imageSize}
              height={imageSize}
            />
          ))}
        {users &&
          table.capacity &&
          table.capacity - users.length >= 0 &&
          [...Array(table.capacity - users.length)].map((e, i) => (
            <span
              key={i}
              onClick={() => onJoinClicked(table.reference, locked)}
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
