import { useSovereignVenue } from "../../../../hooks/useSovereignVenue";
import { useUser } from "../../../../hooks/useUser";
import { useVenueId } from "../../../../hooks/useVenueId";
import { DEFAULT_PARTY_NAME } from "../../../../settings";
import "./ProfilModalBasicTextInfo.scss";
import classNames from "classnames";
import React from "react";
import { ContainerClassName } from "../../../../types/utility";

interface Props extends ContainerClassName {}

export const ProfileModalBasicTextInfo: React.FC<Props> = ({
  containerClassName,
}: Props) => {
  const { userWithId } = useUser();
  const venueId = useVenueId();
  const { sovereignVenue } = useSovereignVenue({ venueId });

  const userStatus =
    sovereignVenue?.showUserStatus &&
    sovereignVenue?.userStatuses?.length &&
    sovereignVenue?.userStatuses?.[0];

  return (
    <div
      className={classNames("ProfileModalBasicTextInfo", containerClassName)}
    >
      <h3 className="ProfileModalBasicTextInfo__name italic">
        {userWithId?.partyName || DEFAULT_PARTY_NAME}
      </h3>
      {userStatus && (
        <div>
          is{" "}
          <span className="ProfileModalBasicTextInfo__status-bold">
            {userStatus.status}
          </span>
        </div>
      )}
    </div>
  );
};
