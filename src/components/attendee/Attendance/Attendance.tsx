import React, { useRef } from "react";

import { UserWithId } from "types/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import CN from "./Attendance.module.scss";

type AttendanceOptions = {
  totalUsersCount?: number;
  usersSample?: UserWithId[];
};

export const Attendance: React.FC<AttendanceOptions> = ({
  totalUsersCount = 0,
  usersSample,
}) => {
  const containerRef = useRef(null);

  const renderedAvatars = usersSample?.map((user) => (
    <UserAvatar
      key={user.id}
      containerClassName={CN.Attendance__userAvatar}
      user={user}
    />
  ));

  return (
    <div className={CN.Attendance} ref={containerRef}>
      <div className={CN.Attendance__avatarsContainer}>{renderedAvatars}</div>
      <span className={CN.Attendance__totalUsersCountText}>
        {totalUsersCount && `${totalUsersCount} users here`}
      </span>
    </div>
  );
};
