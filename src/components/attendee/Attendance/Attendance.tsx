import React, { useRef } from "react";

import { UserWithId } from "types/id";

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
    <div key={user.id} className={CN.Attendance__userAvatar}>
      <div className={CN.Attendance__userAvatarImage}>
        <img src={user.pictureUrl} alt={`Avatar of ${user.partyName}`} />
      </div>
    </div>
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
