import React from "react";
import { User } from "types/User";
import { TableComponentPropsType } from "types/Table";

const DEFAULT_TABLE_CAPACITY = 7;
const JazzbarTableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  table,
  tableLocked,
  experienceName,
  users,
  setSelectedUserProfile,
  tableCapacity = DEFAULT_TABLE_CAPACITY,
  onJoinClicked,
  nameOfVideoRoom,
  imageSize = 35,
}) => {
  const locked = tableLocked(table.reference);
  const people = users.filter(
    (u: User) => u.data?.[experienceName]?.table === table.reference
  );
  return (
    <>
      <div className="profiles">
        <span>{table.title}</span>
        <span>
          {people.map((user: User) => (
            <img
              onClick={() => setSelectedUserProfile(user)}
              key={user.id}
              className="profile-icon"
              src={user.pictureUrl || "/anonymous-profile-icon.jpeg"}
              title={user.partyName}
              alt={`${user.partyName} profile`}
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
