import { useSovereignVenue } from "../../../../hooks/useSovereignVenue";
import { useUser } from "../../../../hooks/useUser";
import { useVenueId } from "../../../../hooks/useVenueId";
import { DEFAULT_PARTY_NAME } from "../../../../settings";
import "./ProfilModalBasicTextInfo.scss";
import classNames from "classnames";
import React from "react";

interface Props {
  className?: string;
}

export const ProfileModalBasicTextInfo: React.FC<Props> = ({
  className,
}: Props) => {
  const { userWithId } = useUser();
  const venueId = useVenueId();
  const { sovereignVenue } = useSovereignVenue({ venueId });

  const userStatus =
    sovereignVenue?.showUserStatus &&
    sovereignVenue?.userStatuses?.length &&
    sovereignVenue?.userStatuses?.[0];

  const containerClassName = classNames("ProfileModalBasicTextInfo", className);

  return (
    <div className={containerClassName}>
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
