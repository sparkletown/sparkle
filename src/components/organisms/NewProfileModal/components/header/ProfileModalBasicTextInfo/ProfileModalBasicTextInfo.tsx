import React from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME } from "settings";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useUser } from "hooks/useUser";

import { UserStatusDropdown } from "components/atoms/UserStatusDropdown";

import "./ProfilModalBasicTextInfo.scss";

export interface ProfileModalBasicTextInfoProps extends ContainerClassName {
  user: WithId<User>;
}

export const ProfileModalBasicTextInfo: React.FC<ProfileModalBasicTextInfoProps> = ({
  user,
  containerClassName,
}) => {
  const { spaceSlug } = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);

  const lastSeenIn = user.lastVenueIdSeenIn;
  const isCurrentUser = useIsCurrentUser(user.id);

  const { user: firebaseUser } = useUser();

  const userStatus = space?.showUserStatus && space?.userStatuses?.[0];

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
      {userStatus && space?.userStatuses && (
        <div className="ProfileModalBasicTextInfo__status">
          is&nbsp;
          <UserStatusDropdown
            userStatuses={space?.userStatuses}
            showDropdown={isCurrentUser}
          />
        </div>
      )}
      {lastSeenIn && !isCurrentUser && (
        <div>
          <span>last seen in</span>{" "}
          <span className="ProfileModalBasicTextInfo--underlined">
            {lastSeenIn}
          </span>
        </div>
      )}
    </div>
  );
};
