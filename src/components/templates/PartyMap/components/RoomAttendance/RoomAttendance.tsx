import React from "react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Room } from "types/rooms";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import styles from "./RoomAttendance.module.scss";

type RoomAttendanceProps = {
  room: Room;
};

// @debt remove this component in favor of UserList
export const RoomAttendance: React.FC<RoomAttendanceProps> = ({ room }) => {
  const portalSpaceId = room.spaceId;

  const { findVenueInRelatedVenues } = useRelatedVenues();

  const portalVenue = findVenueInRelatedVenues({ spaceId: portalSpaceId });

  const numberOfUsersInRoom = portalVenue?.recentUserCount ?? 0;

  if (!numberOfUsersInRoom) {
    return <></>;
  }

  return (
    <div className={styles.RoomAttendance}>
      <FontAwesomeIcon aria-hidden="true" icon={faUsers} />
      {numberOfUsersInRoom}
    </div>
  );
};
