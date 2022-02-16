import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./AddWorldOwnerOutput.scss";

export interface AddWorldOwnerOutputProps {
  userEmail?: string;
  worldAdmins: WithId<User>[];
}

export const AddWorldOwnerOutput: React.FC<AddWorldOwnerOutputProps> = ({
  userEmail,
  worldAdmins,
}) => (
  <div className="AddWorldOwnerOutput">
    {userEmail && <p>{userEmail} was successfully added as a world owner!</p>}
    <p>Admins:</p>
    {worldAdmins.map((worldAdmin) => (
      <p key={worldAdmin.id} className="AddWorldOwnerOutput__AdminRow">
        <UserAvatar user={worldAdmin} size="small" />
        {worldAdmin.partyName}
      </p>
    ))}
  </div>
);
