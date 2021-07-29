import { useSovereignVenue } from "../../../../../hooks/useSovereignVenue";
import { useVenueId } from "../../../../../hooks/useVenueId";
import { DEFAULT_PARTY_NAME } from "../../../../../settings";
import "./ProfilModalBasicTextInfo.scss";
import classNames from "classnames";
import React from "react";
import { ContainerClassName } from "../../../../../types/utility";
import { WithId } from "../../../../../utils/id";
import { User } from "../../../../../types/User";
import { useIsOnline } from "../../../../../hooks/useIsOnline";

interface Props extends ContainerClassName {
  user: WithId<User>;
}

export const ProfileModalBasicTextInfo: React.FC<Props> = ({
  user,
  containerClassName,
}: Props) => {
  const venueId = useVenueId();
  const { sovereignVenue } = useSovereignVenue({ venueId });

  const { lastSeenIn } = useIsOnline(user.id);

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
        {user.partyName || DEFAULT_PARTY_NAME}
      </h3>
      {userStatus && (
        <div>
          is{" "}
          <span className="ProfileModalBasicTextInfo__status-bold">
            {userStatus.status}
          </span>
        </div>
      )}
      {lastVenue && <div>last seen in {lastVenue}</div>}
    </div>
  );
};
