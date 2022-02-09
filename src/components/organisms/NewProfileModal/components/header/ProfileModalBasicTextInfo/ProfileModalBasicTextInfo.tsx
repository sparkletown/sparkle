import React from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME } from "settings";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useUser } from "hooks/useUser";

import { UserStatusDropdown } from "components/atoms/UserStatusDropdown";

import "./ProfilModalBasicTextInfo.scss";

export interface ProfileModalBasicTextInfoProps extends ContainerClassName {
  user: WithId<User>;
}

export const ProfileModalBasicTextInfo: React.FC<
  ProfileModalBasicTextInfoProps
> = ({ user, containerClassName }) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { world } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const isCurrentUser = useIsCurrentUser(user.id);

  const { user: firebaseUser } = useUser();

  const userStatus = world?.showUserStatus && world?.userStatuses?.[0];

  return (
    <div
      className={classNames("ProfileModalBasicTextInfo", containerClassName)}
    >
      <h3 className="ProfileModalBasicTextInfo__name italic">
        {user.partyName || DEFAULT_PARTY_NAME}
      </h3>
      {isCurrentUser && firebaseUser?.email && (
        <div className="ProfileModalBasicTextInfo--light">
          {firebaseUser?.email}
        </div>
      )}
      {userStatus && world?.userStatuses && (
        <div className="ProfileModalBasicTextInfo__status">
          is&nbsp;
          <UserStatusDropdown
            userStatuses={world?.userStatuses}
            showDropdown={isCurrentUser}
          />
        </div>
      )}
    </div>
  );
};
