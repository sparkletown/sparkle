import { useMemo } from "react";
import classNames from "classnames";

import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

import { UserAvatarSize, UserAvatarUserFields } from "./UserAvatar";

interface UserAvatarStatusProps {
  user?: UserAvatarUserFields;
  showStatus?: boolean;
  size?: UserAvatarSize;
}
export const UserAvatarStatus: React.FC<UserAvatarStatusProps> = ({
  user,
  showStatus,
  size,
}) => {
  // @debt until temporarily disable is online functionality
  const isOnline = false;

  const {
    userStatus,
    venueUserStatuses,
    isStatusEnabledForVenue,
  } = useVenueUserStatuses(user);

  const statusIndicatorStyles = useMemo(
    () => ({ backgroundColor: userStatus.color }),
    [userStatus.color]
  );

  const status = user?.status;

  //'isStatusEnabledForVenue' checks if the user status is enabled from the venue config.
  //'showStatus' is used to render this conditionally only in some of the screens.
  const hasUserStatus =
    isStatusEnabledForVenue &&
    // @debt until temporarily disable is online functionality
    // isOnline &&
    showStatus &&
    !!venueUserStatuses.length;

  const statusIndicatorClasses = classNames("UserAvatar__status-indicator", {
    "UserAvatar__status-indicator--online": isOnline,
    [`UserAvatar__status-indicator--${status}`]: isOnline && status,
    [`UserAvatar__status-indicator--${size}`]: size,
  });

  if (!hasUserStatus) return null;

  return (
    <span className={statusIndicatorClasses} style={statusIndicatorStyles} />
  );
};
