import React, { useCallback, useState } from "react";

import { IS_BURN } from "secrets";
import { retainAttendance } from "store/actions/Attendance";
import { openRoomUrl } from "utils/url";

import { Attendances } from "types/Attendances";
import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { RoomVisibility } from "types/Venue";

import { useDispatch } from "hooks/useDispatch";

import CampAttendance from "./CampAttendance";

interface MapRoomOverlayProps {
  // Passed down from Map component
  room: CampRoomData;
  enterCampRoom: (room: CampRoomData) => void;

  // Passed down from Camp component (via Map component)
  venue: CampVenue;
  attendances: Attendances;
  selectedRoom?: CampRoomData;
  selectRoom: (room: CampRoomData) => void;
}

export const MapRoomOverlay: React.FC<MapRoomOverlayProps> = ({
  enterCampRoom,
  room,

  venue,
  attendances,
  selectedRoom,
  selectRoom,
}) => {
  const isSelectedRoom = room === selectedRoom;
  const hasAttendance = attendances[`${venue.name}/${room.title}`];

  // const isRoomExternal = isExternalUrl(room.url);
  // const currentRoomUrl = getRoomUrl(room.url);

  const [roomClicked, setRoomClicked] = useState<string | undefined>(undefined);

  // TODO: can we just roll this logic into whatever is setting roomClicked, then rename above to isRoomClicked?
  const isThisRoomClicked = roomClicked === room.title;

  // TODO: I think this may be intended to toggle 'clicked' for a room
  // TODO: what is a better semantic name for this?
  const onClick1 = useCallback(() => {
    if (!IS_BURN) {
      selectRoom(room);
    } else {
      setRoomClicked((prevRoomClicked) =>
        prevRoomClicked === room.title ? undefined : room.title
      );
    }
  }, [room, selectRoom]);

  const [isRoomHovered, setRoomHovered] = useState<CampRoomData | undefined>(
    undefined
  );

  const dispatch = useDispatch();

  const roomHovered = useCallback(() => {
    dispatch(retainAttendance(true));
    setRoomHovered(room);
  }, [dispatch, room]);

  const roomUnhovered = useCallback(() => {
    dispatch(retainAttendance(false));
    setRoomHovered(undefined);
  }, [dispatch]);

  // TODO: this is being spread here because the below code modifies it with .push()/etc
  // const rooms = [...venue.rooms];

  // TODO: what is the intent/purpose of this?
  // TODO: how do we implement this nicely, and where?
  // TODO: reinstate this functionality
  // if (roomHovered) {
  //   const idx = rooms.findIndex((room) => room.title === roomHovered.title);
  //   if (idx !== -1) {
  //     const chosenRoom = rooms.splice(idx, 1);
  //     rooms.push(chosenRoom[0]);
  //   }
  // }

  // TODO: what is a better semantic name for this?
  const onJoinRoom: React.MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();

      enterCampRoom(room);
      openRoomUrl(room.url);
    },
    [enterCampRoom, room]
  );

  // TODO: should this also openRoomUrl as above? If so, let's use the same function for it.. if not, why?
  // TODO: what is a better semantic name for this?
  // const onClick3 = useCallback(() => enterCampRoom(room), [
  //   enterCampRoom,
  //   room,
  // ]);

  // TODO: what is a better semantic name for this?
  const shouldShowHovered =
    venue.roomVisibility === RoomVisibility.hover &&
    isRoomHovered &&
    isRoomHovered.title === room.title;

  // TODO: what is a better semantic name for this?
  const shouldShow1 =
    !venue.roomVisibility || venue.roomVisibility === RoomVisibility.nameCount;

  // TODO: what is a better semantic name for this?
  const shouldShow2 =
    shouldShow1 ||
    (venue.roomVisibility === RoomVisibility.count && hasAttendance);

  const left = room.x_percent;
  const top = room.y_percent;
  const width = room.width_percent;
  const height = room.height_percent;

  const attendees =
    (attendances[`${venue.name}/${room.title}`] ?? 0) +
    (room.attendanceBoost ?? 0);

  if (!room.isEnabled) return null;

  return (
    <div
      className={`room position-absolute ${isSelectedRoom && "isUnderneath"}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      key={room.title}
      onClick={onClick1}
      onMouseEnter={roomHovered}
      onMouseLeave={roomUnhovered}
    >
      <div className={`camp-venue ${isThisRoomClicked ? "clicked" : ""}`}>
        <div className={`grid-room-btn ${isSelectedRoom && "isUnderneath"}`}>
          <div
            className="btn btn-white btn-small btn-block"
            onClick={onJoinRoom}
          >
            {venue.joinButtonText ?? "Join now"}
          </div>
        </div>
        <div className="camp-venue-img">
          <img src={room.image_url} title={room.title} alt={room.title} />
        </div>

        {shouldShowHovered && attendees > 0 && (
          <div className="camp-venue-text">
            <div className="camp-venue-maininfo">
              <div className="camp-venue-title">{room.title}</div>
              <CampAttendance attendees={attendees} />
            </div>
          </div>
        )}

        <div className="camp-venue-text">
          {shouldShow2 && (
            <div className="camp-venue-maininfo">
              {/* TODO: the definition of shouldShow2 seems to use shouldShow1, so there's probably no point to this check? */}
              {shouldShow1 && (
                <div className="camp-venue-title">{room.title}</div>
              )}
              <CampAttendance attendees={attendees} />
            </div>
          )}

          <div className="camp-venue-secondinfo">
            <div className="camp-venue-desc">
              <p>{room.subtitle}</p>
              <p>{room.about}</p>
            </div>

            <div className="camp-venue-actions">
              {/* TODO: extract this into a generalised link component that handles internal/external correctly? */}
              <button
                className="btn btn-block btn-small btn-primary"
                onClick={onJoinRoom}
                // href={currentRoomUrl}
                // {...getExtraLinkProps(isRoomExternal)}
              >
                {venue.joinButtonText ?? "Enter"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
