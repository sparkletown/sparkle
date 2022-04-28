import React from "react";

import { DEFAULT_PARTY_NAME } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useLiveUser } from "hooks/user/useLiveUser";

export interface ProfileModalBasicTextInfoProps {
  user: WithId<User>;
}

export const ProfileModalBasicTextInfo: React.FC<ProfileModalBasicTextInfoProps> = ({
  user,
}) => {
  const isCurrentUser = useIsCurrentUser(user.id);
  const { user: firebaseUser } = useLiveUser();

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
    </div>
  );
};
