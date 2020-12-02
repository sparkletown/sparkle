import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import { retainAttendance } from "store/actions/Attendance";

import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/RoomData";
import { RoomVisibility } from "types/Venue";

import { isTruthy } from "utils/types";

import { useDispatch } from "hooks/useDispatch";

import RoomAttendance from "../RoomAttendance";

interface MapRoomOverlayProps {
  // Passed down from Map component
  room: PartyMapRoomData;
  enterRoom: (room: PartyMapRoomData) => void;

  // Passed down from Camp component (via Map component)
  venue: PartyMapVenue;
  selectedRoom?: PartyMapRoomData;
  selectRoom: (room: PartyMapRoomData) => void;
  unselectRoom: () => void;
}

export const MapRoomOverlay: React.FC<MapRoomOverlayProps> = ({
  room,
  venue,
  selectedRoom,
  selectRoom,
  unselectRoom,
}) => {
  const isSelectedRoom = room === selectedRoom;

  // const isRoomExternal = isExternalUrl(room.url);
  // const currentRoomUrl = getRoomUrl(room.url);

  // TODO: what is a better semantic name for this?
  const onClick1 = useCallback(() => {
    selectRoom(room);
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

  const showRoomTitleAlways =
    !venue.roomVisibility ||
    venue.roomVisibility === RoomVisibility.nameCount ||
    venue.roomVisibility === RoomVisibility.count;

  const showRoomTitleWhenHovered =
    venue.roomVisibility === RoomVisibility.hover &&
    roomHovered?.title === room.title;

  const showRoomTitle =
    showRoomTitleAlways || (showRoomTitleWhenHovered && isRoomHovered);

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
      className={classNames("room position-absolute", {
        "room-selected": isSelectedRoom,
      })}
      style={containerStyles}
      // TODO: is this unique? Do we even need a key here since we're not directly inside a loop?
      // key={room.title}
      onClick={onClick1}
      onMouseEnter={handleRoomHovered}
      onMouseLeave={handleRoomUnhovered}
    >
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
      {showRoomTitle && (
        <div className="camp-venue-text">
          <div className="camp-venue-maininfo">
            <div className="party-map-venue-title">{room.title}</div>
            <RoomAttendance venue={venue} room={room} />
          </div>
        </div>
      )}

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
