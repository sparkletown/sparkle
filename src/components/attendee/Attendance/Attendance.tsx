import React, { useMemo, useRef } from "react";

import { ATTENDEE_HEADER_AVATAR_LIMIT } from "settings";

import { SpaceWithId } from "types/id";

import { usePresenceData } from "hooks/user/usePresence";

import { UserAvatar } from "components/atoms/UserAvatar";

import CN from "./Attendance.module.scss";

type AttendanceOptions = {
  space: SpaceWithId;
};

export const Attendance: React.FC<AttendanceOptions> = ({ space }) => {
  const containerRef = useRef(null);

  const { isLoading, presentUsers } = usePresenceData({
    spaceId: space.id,
    limit: ATTENDEE_HEADER_AVATAR_LIMIT,
  });

  const renderedAvatars = useMemo(
    () =>
      presentUsers.map((user) => (
        <UserAvatar
          key={user.id}
          containerClassName={CN.Attendance__userAvatar}
          user={user}
        />
      )),
    [presentUsers]
  );

  if (isLoading) {
    return null;
  }

  const numberUsersPresent =
    presentUsers.length === ATTENDEE_HEADER_AVATAR_LIMIT
      ? space.presentUserCachedCount
      : presentUsers.length;
  const inflectedUser = numberUsersPresent > 1 ? "users" : "user";

  return (
    <div className={CN.Attendance} ref={containerRef}>
      <div className={CN.Attendance__avatarsContainer}>{renderedAvatars}</div>
      <span className={CN.Attendance__totalUsersCountText}>
        {`${numberUsersPresent} ${inflectedUser} here`}
      </span>
    </div>
  );
};
