import React, { useCallback, useMemo, useState } from "react";

import { retainAttendance } from "store/actions/Attendance";

import { Attendances } from "types/Attendances";
import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/RoomData";
import { RoomVisibility } from "types/Venue";

import { isTruthy } from "utils/types";

import { useDispatch } from "hooks/useDispatch";

import RoomAttendance from "../RoomAttendance";

interface PartyMapRoomOverlayProps {
  // Passed down from Map component
  room: PartyMapRoomData;
  enterRoom: (room: PartyMapRoomData) => void;

  // Passed down from Camp component (via Map component)
  venue: PartyMapVenue;
  attendances: Attendances;
  selectedRoom?: PartyMapRoomData;
  selectRoom: (room: PartyMapRoomData) => void;
  unselectRoom: () => void;
}

export const PartyMapRoomOverlay: React.FC<PartyMapRoomOverlayProps> = ({
  room,
  venue,
  attendances,
  selectedRoom,
  selectRoom,
  unselectRoom,
}) => {
  const isSelectedRoom = room === selectedRoom;

  // TODO: can we cleanup/de-dupe these attendance/attendees things?
  const attendees =
    (attendances[`${venue.name}/${room.title}`] ?? 0) +
    (room.attendanceBoost ?? 0);
  const hasAttendance = attendances[`${venue.name}/${room.title}`];
  const hasAttendees = attendees > 0;

  // const isRoomExternal = isExternalUrl(room.url);
  // const currentRoomUrl = getRoomUrl(room.url);

  // TODO: do we still need this?
  // const [roomClicked, setRoomClicked] = useState<string | undefined>(undefined);
  // TODO: do we need the whole room object? Can we just roll this logic into whatever is setting roomClicked, then rename above to isRoomClicked?
  // const isThisRoomClicked = roomClicked === room.title;

  // TODO: I think this may be intended to toggle 'clicked' for a room, do we need to separately keep track of 'clicked'? Or is it the same as selecting the room?
  // TODO: what is a better semantic name for this?
  const onClick1 = useCallback(() => {
    // if (!IS_BURN) {
    selectRoom(room);
    // } else {
    // setRoomClicked((prevRoomClicked) =>
    //   prevRoomClicked === room.title ? undefined : room.title
    // );
    // }
  }, [room, selectRoom]);

  // TODO: this was used in place of onClick1 in PartyMap Map before I merged them, is it correct? Or is the onClick1 definition above?
  // const toggleRoom = useCallback(() => {
  //   selectRoom(room);
  // }, [room, selectRoom]);

  const [roomHovered, setRoomHovered] = useState<PartyMapRoomData | undefined>(
    undefined
  );

  const isRoomHovered = isTruthy(roomHovered);

  const dispatch = useDispatch();

  const handleRoomHovered = useCallback(() => {
    setRoomHovered(room);
    dispatch(retainAttendance(true));
  }, [dispatch, room]);

  const handleRoomUnhovered = useCallback(() => {
    setRoomHovered(undefined);
    dispatch(retainAttendance(false));
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
  // const onJoinRoom: React.MouseEventHandler = useCallback(
  //   (e) => {
  //     e.stopPropagation();
  //
  //     if (isExternalUrl(room.url)) {
  //       openRoomUrl(room.url);
  //     } else {
  //       window.location.href = getRoomUrl(room.url);
  //     }
  //
  //     enterCampRoom(room);
  //   },
  //   [enterCampRoom, room]
  // );

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
    roomHovered?.title === room.title;

  // TODO: what is a better semantic name for this?
  const shouldShow1 =
    !venue.roomVisibility || venue.roomVisibility === RoomVisibility.nameCount;

  // TODO: what is a better semantic name for this?
  const shouldShow2 =
    shouldShow1 ||
    (venue.roomVisibility === RoomVisibility.count && hasAttendance);

  const containerStyles = useMemo(
    () => ({
      left: `${room.x_percent}%`,
      top: `${room.y_percent}%`,
      width: `${room.width_percent}%`,
      height: `${room.height_percent}%`,
    }),
    [room.height_percent, room.width_percent, room.x_percent, room.y_percent]
  );

  return (
    <div
      className={`room position-absolute ${isSelectedRoom && "isUnderneath"}`}
      style={containerStyles}
      // TODO: is this unique? Do we even need a key here since we're not directly inside a loop?
      // key={room.title}
      onClick={onClick1}
      onMouseEnter={handleRoomHovered}
      onMouseLeave={handleRoomUnhovered}
    >
      {/* TODO: this is what Camp's version had: <div className={`camp-venue ${isThisRoomClicked ? "clicked" : ""}`}>*/}
      {/*<div className={`camp-venue ${isSelectedRoom ? "clicked" : ""}`}>*/}
      {/* TODO: is this needed here anymore? */}
      {/*<div className={`grid-room-btn ${isSelectedRoom && "isUnderneath"}`}>*/}
      {/*  <div*/}
      {/*      className="btn btn-white btn-small btn-block"*/}
      {/*      onClick={onJoinRoom}*/}
      {/*  >*/}
      {/*    {venue.joinButtonText ?? "Join now"}*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* TODO: rename this class something other than camp-venue-*? */}
      <div className="camp-venue-img">
        <img src={room.image_url} title={room.title} alt={room.title} />
      </div>

      {/* TODO: rename these classes something other than camp-venue-*? */}
      {shouldShowHovered && hasAttendees && (
        <div className="camp-venue-text">
          <div className="camp-venue-maininfo">
            <div className="party-map-venue-title">{room.title}</div>
            <RoomAttendance venue={venue} room={room} />
          </div>
        </div>
      )}

      <div className={`camp-venue-text`}>
        {shouldShow2 && (
          <div className="camp-venue-maininfo">
            {/* TODO: the definition of shouldShow2 seems to use shouldShow1, so there's probably no point to this check? */}
            {shouldShow1 && (
              <div className="party-map-venue-title">{room.title}</div>
            )}
            <RoomAttendance venue={venue} room={room} />
          </div>
        )}
      </div>

      {/* TODO: this was in Camp MapRoomOverlay, do we need it still?*/}
      {/*<div className="camp-venue-secondinfo">*/}
      {/*  <div className="camp-venue-desc">*/}
      {/*    <p>{room.subtitle}</p>*/}
      {/*    <p>{room.about}</p>*/}
      {/*  </div>*/}
      {/*  <div className="camp-venue-actions">*/}
      {/*    /!* TODO: extract this into a generalised link component that handles internal/external correctly? *!/*/}
      {/*    <a*/}
      {/*      className="btn btn-block btn-small btn-primary"*/}
      {/*      onClick={onClick3}*/}
      {/*      href={currentRoomUrl}*/}
      {/*      {...getExtraLinkProps(isRoomExternal)}*/}
      {/*    >*/}
      {/*      {venue.joinButtonText ?? "Enter"}*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
