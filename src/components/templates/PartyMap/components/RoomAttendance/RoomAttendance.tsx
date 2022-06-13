import React, { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, DEFAULT_ROOM_ATTENDANCE_LIMIT } from "settings";

import { Room } from "types/rooms";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RoomAttendance.scss";

type RoomAttendanceProps = {
  room: Room;
  maxVisible?: number;
};

// @debt remove this component in favor of UserList
export const RoomAttendance: React.FC<RoomAttendanceProps> = ({
  room,
  maxVisible = DEFAULT_ROOM_ATTENDANCE_LIMIT,
}) => {
  const portalSpaceId = room.spaceId;

  const { findVenueInRelatedVenues } = useRelatedVenues();

  const portalVenue = findVenueInRelatedVenues({ spaceId: portalSpaceId });

  const numberOfUsersInRoom = portalVenue?.recentUserCount ?? 0;

  const numberOfExtraUsersInRoom = Math.max(
    numberOfUsersInRoom - maxVisible,
    0
  );
  const hasExtraUsersInRoom = numberOfExtraUsersInRoom > 0;

  const userList = portalVenue?.recentUsersSample ?? ALWAYS_EMPTY_ARRAY;
  // @debt use a default image when user.pictureUrl is undefined
  const userAvatars = useMemo(
    () =>
      userList.slice(0, maxVisible).map((user) => (
        <UserAvatar
          key={user.id}
          size="small"
          user={user}
          containerClassName="attendance-avatar"
        />
        // <div key={`user-avatar-${user.id}`}>
        //   <div
        //     className="attendance-avatar"
        //     style={{ backgroundImage: `url(${user.pictureUrl})` }}
        //   />
        // </div>
      )),
    [maxVisible, userList]
  );

  return (
    <div className="attendance-avatars">
      {userAvatars}

      {hasExtraUsersInRoom && (
        <div className="avatars-inside">+{numberOfExtraUsersInRoom}</div>
      )}
    </div>
  );
};
