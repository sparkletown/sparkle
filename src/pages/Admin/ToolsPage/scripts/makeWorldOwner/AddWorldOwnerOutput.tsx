import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";
import { determineAvatar } from "utils/image";

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
    <br />
    <p>Admins:</p>
    {worldAdmins.map((worldAdmin) => (
      <div key={worldAdmin.id} className="flex items-center mb-2">
        <div>
          <img
            className="inline-block h-9 w-9 rounded-full"
            alt="user's avatar"
            {...determineAvatar({
              user: worldAdmin,
            })}
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{worldAdmin.partyName}</p>
        </div>
      </div>
    ))}
  </div>
);
