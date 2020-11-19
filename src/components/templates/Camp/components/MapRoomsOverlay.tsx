import React, { useState } from "react";

import { IS_BURN } from "secrets";
import { retainAttendance } from "store/actions/Attendance";
import { getRoomUrl, isExternalUrl, openRoomUrl } from "utils/url";

import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { RoomVisibility } from "types/Venue";

import { useDispatch } from "hooks/useDispatch";

import CampAttendance from "./CampAttendance";

interface MapRoomsProps {
  // Passed down from useKeyboardControls() hook via Map component
  roomEnter: (room: CampRoomData) => void;

  // Passed down from Map component
  isHittingRoom: boolean;

  // Passed down from Camp component
  venue: CampVenue;
  // rooms: readonly CampRoomData[];
  attendances: { [location: string]: number };
  selectedRoom?: CampRoomData;
  setSelectedRoom: (room?: CampRoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

export const MapRoomsOverlay: React.FC<MapRoomsProps> = ({
  venue,
  // rooms: _rooms,
  selectedRoom,
  attendances,
  isHittingRoom,
  setSelectedRoom,
  setIsRoomModalOpen,
  roomEnter,
}) => {
  // TODO: this is being spread here because other code modifies it with .push()/etc
  // const rooms = [..._rooms];
  const rooms = [...venue.rooms];

  const dispatch = useDispatch();

  const [roomClicked, setRoomClicked] = useState<string | undefined>(undefined);
  const [roomHovered, setRoomHovered] = useState<CampRoomData | undefined>(
    undefined
  );

  // TODO: memo this?
  if (roomHovered) {
    const idx = rooms.findIndex((room) => room.title === roomHovered.title);
    if (idx !== -1) {
      const chosenRoom = rooms.splice(idx, 1);
      rooms.push(chosenRoom[0]);
    }
  }

  // TODO: useCallback this in Camp? Maybe called selectRoom?
  const openModal = (room: CampRoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  // TODO: useCallback
  const onJoinRoom = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    room: CampRoomData
  ) => {
    e.stopPropagation();

    if (isExternalUrl(room.url)) {
      openRoomUrl(room.url);
    } else {
      window.location.href = getRoomUrl(room.url);
    }

    roomEnter(room);
  };

  return (
    <div>
      {!!rooms.length &&
        rooms.map((room) => {
          const left = room.x_percent;
          const top = room.y_percent;
          const width = room.width_percent;
          const height = room.height_percent;
          const isUnderneathRoom = isHittingRoom && room === selectedRoom;
          const hasAttendance = attendances[`${venue.name}/${room.title}`];
          return (
            <div
              className={`room position-absolute ${
                isUnderneathRoom && "isUnderneath"
              }`}
              style={{
                left: left + "%",
                top: top + "%",
                width: width + "%",
                height: height + "%",
              }}
              key={room.title}
              onClick={() => {
                if (!IS_BURN) {
                  openModal(room);
                } else {
                  setRoomClicked((prevRoomClicked) =>
                    prevRoomClicked === room.title ? undefined : room.title
                  );
                }
              }}
              onMouseEnter={() => {
                dispatch(retainAttendance(true));
                setRoomHovered(room);
              }}
              onMouseLeave={() => {
                dispatch(retainAttendance(false));
                setRoomHovered(undefined);
              }}
            >
              <div
                className={`camp-venue ${
                  roomClicked === room.title ? "clicked" : ""
                }`}
              >
                <div
                  className={`grid-room-btn ${
                    isUnderneathRoom && "isUnderneath"
                  }`}
                >
                  <div
                    className="btn btn-white btn-small btn-block"
                    onClick={(e) => onJoinRoom(e, room)}
                  >
                    {venue.joinButtonText ?? "Join now"}
                  </div>
                </div>
                <div className="camp-venue-img">
                  <img
                    src={room.image_url}
                    title={room.title}
                    alt={room.title}
                  />
                </div>
                {venue.roomVisibility === RoomVisibility.hover &&
                  roomHovered &&
                  roomHovered.title === room.title && (
                    <div className="camp-venue-text">
                      <div className="camp-venue-maininfo">
                        <div className="camp-venue-title">{room.title}</div>
                        <CampAttendance
                          attendances={attendances}
                          venue={venue}
                          room={room}
                        />
                      </div>
                    </div>
                  )}

                <div className={`camp-venue-text`}>
                  {(!venue.roomVisibility ||
                    venue.roomVisibility === RoomVisibility.nameCount ||
                    (venue.roomVisibility === RoomVisibility.count &&
                      hasAttendance)) && (
                    <div className="camp-venue-maininfo">
                      {(!venue.roomVisibility ||
                        venue.roomVisibility === RoomVisibility.nameCount) && (
                        <div className="camp-venue-title">{room.title}</div>
                      )}
                      <CampAttendance
                        attendances={attendances}
                        venue={venue}
                        room={room}
                      />
                    </div>
                  )}
                  <div className="camp-venue-secondinfo">
                    <div className="camp-venue-desc">
                      <p>{room.subtitle}</p>
                      <p>{room.about}</p>
                    </div>
                    <div className="camp-venue-actions">
                      {isExternalUrl(room.url) ? (
                        <a
                          className="btn btn-block btn-small btn-primary"
                          onClick={() => roomEnter(room)}
                          href={getRoomUrl(room.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {venue.joinButtonText ?? "Join the room"}
                        </a>
                      ) : (
                        <a
                          className="btn btn-block btn-small btn-primary"
                          onClick={() => roomEnter(room)}
                          href={getRoomUrl(room.url)}
                        >
                          {venue.joinButtonText ?? "Join the room"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
