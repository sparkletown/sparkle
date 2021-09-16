import React, { useMemo } from "react";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { TableComponentPropsType } from "types/Table";

import { useProfileModalControls } from "hooks/useProfileModalControls";

const DEFAULT_TABLE_CAPACITY = 7;
const JazzbarTableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  table,
  tableLocked,
  experienceName,
  users,
  tableCapacity = DEFAULT_TABLE_CAPACITY,
  onJoinClicked,
  nameOfVideoRoom,
  imageSize = 35,
}) => {
  const { openUserProfileModal } = useProfileModalControls();
  const locked = tableLocked(table.reference);

  const people = useMemo(
    () =>
      users.filter((u) => u.data?.[experienceName]?.table === table.reference),
    [users, experienceName, table]
  );

  return (
    <>
      <div className="profiles">
        <span>{table.reference}</span>
        <span>
          {people.map((user, idx) => (
            <img
              onClick={() => openUserProfileModal(user.id)}
              key={`${user.room}-${idx}`}
              className="profile-icon"
              src={
                user.anonMode || !user.pictureUrl
                  ? DEFAULT_PROFILE_IMAGE
                  : user.pictureUrl
              }
              title={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
              alt={`${
                user.anonMode ? DEFAULT_PARTY_NAME : user.partyName
              } profile`}
              width={imageSize}
              height={imageSize}
            />
          ))}
          {people.length === 0 && "No one is at this table"}
        </span>
        {people.length >= tableCapacity ? (
          <button
            type="button"
            title={table.reference + " is full"}
            className={"btn disabled"}
            disabled
          >
            Full
          </button>
        ) : (
          <button
            type="button"
            title={"Join " + table.reference}
            className={"btn " + (locked ? "disabled" : "")}
            id={`join-table-${table.reference}`}
            onClick={() =>
              onJoinClicked(table.reference, locked, nameOfVideoRoom)
            }
          >
            Join
          </button>
        )}
      </div>
    </>
  );
};

export default JazzbarTableComponent;
