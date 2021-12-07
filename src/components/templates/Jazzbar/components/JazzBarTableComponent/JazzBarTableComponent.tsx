import React from "react";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { TableComponentPropsType } from "types/Table";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import "./JazzBarTableComponent.scss";

// @debt THIS COMPONENT IS THE COPY OF components/molecules/TableComponent
// The reason to copy it was the lack of time to refactor the whole thing, so the
// safest approch (not to break other Venues that rely on TableComponent) is to copy this component
// It needs to get deleted in the future
export const JazzBarTableComponent: React.FunctionComponent<TableComponentPropsType> = ({
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
    <div className={`jazzbar-table-component-container ${table.reference}`}>
      <div className="table-item">
        <div className="table-occupancy-information red-text">
          {locked ? "locked" : full ? "full" : ""}
        </div>
        <div className="table-number">{table.title}</div>

        {users.map((user) => (
          <img
            onClick={() => openUserProfileModal(user.id)}
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
