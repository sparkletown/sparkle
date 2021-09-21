import React from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME } from "settings";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useIsOnline } from "hooks/useIsOnline";
import { useRelatedVenues } from "hooks/useRelatedVenues";
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
  const { sovereignVenue } = useRelatedVenues();

  const { lastSeenIn } = useIsOnline(user.id);
  const isCurrentUser = useIsCurrentUser(user.id);
  const { user: firebaseUser } = useUser();

  const lastVenue = lastSeenIn ? Object.keys(lastSeenIn)[0] : undefined;

  const userStatus =
    sovereignVenue?.showUserStatus && sovereignVenue?.userStatuses?.[0];

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
      {userStatus && sovereignVenue?.userStatuses && (
        <div className="ProfileModalBasicTextInfo__status">
          is&nbsp;
          <UserStatusDropdown
            userStatuses={sovereignVenue?.userStatuses}
            showDropdown={isCurrentUser}
          />
        </div>
      )}
      {lastVenue && !isCurrentUser && (
        <div>
          <span>last seen in</span>{" "}
          <span className="ProfileModalBasicTextInfo--underlined">
            {lastVenue}
          </span>
        </div>
      )}
    </div>
  );
};
