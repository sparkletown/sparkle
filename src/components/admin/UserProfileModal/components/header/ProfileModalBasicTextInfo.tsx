import React from "react";
import { UserStatusDropdown } from "components/admin/UserStatusDropdown";

import { DEFAULT_PARTY_NAME, STRING_NON_BREAKING_SPACE } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useUser } from "hooks/useUser";

export interface ProfileModalBasicTextInfoProps {
  user: WithId<User>;
}

export const ProfileModalBasicTextInfo: React.FC<ProfileModalBasicTextInfoProps> = ({
  user,
}) => {
  const { world } = useWorldAndSpaceByParams();
  const isCurrentUser = useIsCurrentUser(user.id);
  const { user: firebaseUser } = useUser();

  const userStatus = world?.showUserStatus && world?.userStatuses?.[0];

  return (
    <div data-bem="ProfileModalBasicTextInfo" className="flex flex-col">
      <h2 data-bem="ProfileModalBasicTextInfo__name" className="font-sm">
        {user.partyName || DEFAULT_PARTY_NAME}
      </h2>
      {isCurrentUser && firebaseUser?.email && (
        <div
          data-bem="ProfileModalBasicTextInfo--light"
          className="font-sm text-gray-700"
        >
          {firebaseUser?.email}
        </div>
      )}
      {userStatus && world?.userStatuses && (
        <div
          data-bem="ProfileModalBasicTextInfo__status"
          className="font-xs flex"
        >
          is{STRING_NON_BREAKING_SPACE}
          <UserStatusDropdown
            userStatuses={world?.userStatuses}
            showDropdown={isCurrentUser}
          />
        </div>
      )}
    </div>
  );
};
