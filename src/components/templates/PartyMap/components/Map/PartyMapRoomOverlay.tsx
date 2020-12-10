import React, { useCallback, useState } from "react";

import { retainAttendance } from "store/actions/Attendance";

import { Attendances } from "types/Attendances";
import { PartyMapRoomData } from "types/PartyMapRoomData";
import { RoomVisibility } from "types/Venue";
import { PartyMapVenue } from "types/PartyMapVenue";

import { useDispatch } from "hooks/useDispatch";

import RoomAttendance from "../RoomAttendance";

interface PartyMapRoomOverlayProps {
  // Passed down from Map component
  room: PartyMapRoomData;

  // Passed down from Camp component (via Map component)
  venue: PartyMapVenue;
  attendances: Attendances;
  selectedRoom?: PartyMapRoomData;
  setSelectedRoom: (room?: PartyMapRoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

export const PartyMapRoomOverlay: React.FC<PartyMapRoomOverlayProps> = ({
  room,
  venue,
  attendances,
  selectedRoom,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  const isSelectedRoom = room === selectedRoom;
  const hasAttendance = attendances[`${venue.name}/${room.title}`];

  // TODO: Pass this down from Camp, maybe called selectRoom?
  const selectRoom = useCallback(
    (room: PartyMapRoomData) => {
      setSelectedRoom(room);
      setIsRoomModalOpen(true);
    },
    [setIsRoomModalOpen, setSelectedRoom]
  );

  const toggleRoom = useCallback(() => {
    selectRoom(room);
  }, [room, selectRoom]);

  const [isRoomHovered, setRoomHovered] = useState<
    PartyMapRoomData | undefined
  >(undefined);

  const dispatch = useDispatch();

  const roomHovered = useCallback(() => {
    dispatch(retainAttendance(true));
    setRoomHovered(room);
  }, [dispatch, room]);

  const roomUnhovered = useCallback(() => {
    dispatch(retainAttendance(false));
    setRoomHovered(undefined);
  }, [dispatch]);

  const left = room.x_percent;
  const top = room.y_percent;
  const width = room.width_percent;
  const height = room.height_percent;

  if (!room.isEnabled) return null;

  return (
    <div
      className={`room position-absolute ${isSelectedRoom && "isUnderneath"}`}
      style={{
        left: left + "%",
        top: top + "%",
        width: width + "%",
        height: height + "%",
      }}
      key={room.title}
      onClick={toggleRoom}
      onMouseEnter={roomHovered}
      onMouseLeave={roomUnhovered}
    >
      <div className={`camp-venue ${isSelectedRoom ? "clicked" : ""}`}>
        <div className="camp-venue-img">
          <img src={room.image_url} title={room.title} alt={room.title} />
        </div>
        {venue.roomVisibility === RoomVisibility.hover &&
          isRoomHovered &&
          isRoomHovered.title === room.title && (
            <div className="camp-venue-text">
              <div className="camp-venue-maininfo">
                <div className="party-map-venue-title">{room.title}</div>
                <RoomAttendance venue={venue} room={room} />
              </div>
            </div>
          )}

        {(!venue.roomVisibility ||
          venue.roomVisibility === RoomVisibility.nameCount ||
          (venue.roomVisibility === RoomVisibility.count && hasAttendance)) && (
          <div className={`camp-venue-text`}>
            <div className="camp-venue-maininfo">
              {(!venue.roomVisibility ||
                venue.roomVisibility === RoomVisibility.nameCount) && (
                <div className="party-map-venue-title">{room.title}</div>
              )}
              {hasAttendance && <RoomAttendance venue={venue} room={room} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
