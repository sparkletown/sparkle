import React from "react";
import classNames from "classnames";

import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useVenueId } from "hooks/useVenueId";
import { useIsOnline } from "hooks/useIsOnline";
import { useIsSameUser } from "hooks/useIsSameUser";
import { useUser } from "hooks/useUser";

import { UserStatusDropdown } from "components/atoms/UserStatusDropdown";

import { ContainerClassName } from "types/utility";
import { WithId } from "utils/id";
import { User } from "types/User";

import { DEFAULT_PARTY_NAME } from "settings";

import "./ProfilModalBasicTextInfo.scss";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
}

export const ProfileModalBasicTextInfo: React.FC<Props> = ({
  viewingUser,
  containerClassName,
}: Props) => {
  const venueId = useVenueId();
  const { sovereignVenue } = useSovereignVenue({ venueId });

  const { lastSeenIn } = useIsOnline(viewingUser.id);
  const sameUser = useIsSameUser(viewingUser);
  const { user: firebaseUser } = useUser();

  const lastVenue = lastSeenIn ? Object.keys(lastSeenIn)[0] : undefined;

  const userStatus =
    sovereignVenue?.showUserStatus &&
    sovereignVenue?.userStatuses?.length &&
    sovereignVenue?.userStatuses?.[0];

  return (
    <div
      className={classNames("ProfileModalBasicTextInfo", containerClassName)}
    >
      <h3 className="ProfileModalBasicTextInfo__name italic">
        {viewingUser.partyName || DEFAULT_PARTY_NAME}
      </h3>
      {sameUser && firebaseUser?.email && (
        <div className="ProfileModalBasicTextInfo--light">
          {firebaseUser?.email}
        </div>
      )}
      {userStatus && sovereignVenue?.userStatuses && (
        <div className="ProfileModalBasicTextInfo__status">
          is&nbsp;
          <UserStatusDropdown
            userStatuses={sovereignVenue?.userStatuses}
            showDropdown={sameUser}
          />
        </div>
      )}
      {lastVenue && !sameUser && (
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
