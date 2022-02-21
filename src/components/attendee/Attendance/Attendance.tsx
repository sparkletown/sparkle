import React, { useRef } from "react";

import { UserWithId } from "types/id";

import { useComponentDismensions } from "hooks/useComponentDimensions";

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

  const { height, width } = useComponentDismensions({
    componentRef: containerRef,
  });

  const renderedAvatars = usersSample?.map((user) => (
    <div key={user.id} className={CN.Attendance__userAvatar}>
      <div className={CN.Attendance__userAvatarImage}>
        <img src={user.pictureUrl} alt={`Avatar of ${user.partyName}`} />
      </div>
    </div>
  ));

  const displayedUsersCount = usersSample?.length ?? 0;

  const hiddenUsersCount = totalUsersCount - displayedUsersCount;

  const hasHiddenUsers = hiddenUsersCount > 0;

  console.log(height, width);

  return (
    <div className={CN.Attendance} ref={containerRef}>
      <div className={CN.Attendance__avatarsContainer}>{renderedAvatars}</div>
      <span className={CN.Attendance__hiddenUsersCountText}>
        {hasHiddenUsers && `+ ${hiddenUsersCount} others`}
      </span>
    </div>
  );
};
