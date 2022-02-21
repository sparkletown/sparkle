import React, { useRef } from "react";

import { UserWithId } from "types/id";

import { useComponentDismensions } from "hooks/useComponentDimensions";

import CN from "./Attendance.module.scss";

const avatarWidth = 30;
const avatarMargin = -10;
const avatarSize = avatarWidth + avatarMargin;

type AttendanceOptions = {
  totalUsersCount?: number;
  usersSample?: UserWithId[];
};

export const Attendance: React.FC<AttendanceOptions> = ({
  totalUsersCount = 0,
  usersSample,
}) => {
  const avatarsContainerRef = useRef(null);

  const { width: avatarsContainerWidth } = useComponentDismensions({
    componentRef: avatarsContainerRef,
  });

  const renderedAvatars = usersSample?.map((user, index) => (
    <div key={`${user.id}-${index}`} className={CN.Attendance__userAvatar}>
      <div className={CN.Attendance__userAvatarImage}>
        <img src={user.pictureUrl} alt={`Avatar of ${user.partyName}`} />
      </div>
    </div>
  ));

  const sampleUserCount = usersSample?.length ?? 0;

  const possibleDisplayCount = Math.floor(
    (avatarsContainerWidth + avatarMargin) / avatarSize
  );

  const displayedUsersCount = Math.min(sampleUserCount, possibleDisplayCount);

  const hiddenUsersCount = totalUsersCount - displayedUsersCount;

  const hasHiddenUsers = hiddenUsersCount > 0;

  return (
    <div className={CN.Attendance}>
      <div
        className={CN.Attendance__avatarsContainer}
        ref={avatarsContainerRef}
      >
        {renderedAvatars}
      </div>
      <span className={CN.Attendance__hiddenUsersCountText}>
        {hasHiddenUsers && `+ ${hiddenUsersCount} others`}
      </span>
    </div>
  );
};
