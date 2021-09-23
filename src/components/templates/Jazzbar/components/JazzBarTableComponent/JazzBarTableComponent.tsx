import React, { useMemo } from "react";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { TableComponentPropsType } from "types/Table";

import { currentVenueSelector } from "utils/selectors";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useSelector } from "hooks/useSelector";

import "./JazzBarTableComponent.scss";

// @debt THIS COMPONENT IS THE COPY OF components/molecules/TableComponent
// The reason to copy it was the lack of time to refactor the whole thing, so the
// safest approch (not to break other Venues that rely on TableComponent) is to copy this component
// It needs to get deleted in the future
export const JazzBarTableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  experienceName,
  imageSize = 50,
  table,
  tableLocked,
}) => {
  const { openUserProfileModal } = useProfileModalControls();
  const venue = useSelector(currentVenueSelector);
  const locked = tableLocked(table.reference);
  const usersSeatedAtTable = useMemo(
    () =>
      users.filter((u) => u.data?.[experienceName]?.table === table.reference),
    [users, experienceName, table]
  );

  const numberOfSeatsLeft =
    table.capacity && table.capacity - usersSeatedAtTable.length;
  const full = numberOfSeatsLeft === 0;

  return (
    <div className={`jazzbar-table-component-container ${table.reference}`}>
      <div className="table-item">
        <div className="table-occupancy-information red-text">
          {locked ? "locked" : full ? "full" : ""}
        </div>
        <div className="table-number">{table.title}</div>

        {usersSeatedAtTable.map((user) => (
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

        {usersSeatedAtTable &&
          table.capacity &&
          table.capacity - usersSeatedAtTable.length >= 0 &&
          [...Array(table.capacity - usersSeatedAtTable.length)].map((e, i) => (
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
