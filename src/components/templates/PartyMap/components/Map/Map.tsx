import React, { useEffect, useMemo, useState } from "react";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { RefiAuthUser } from "types/fire";
import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import { useValidImage } from "hooks/useCheckImage";

import { MapRoom } from "./MapRoom";

import "./Map.scss";

export const DEFAULT_COLUMNS = 40;
export const DEFAULT_ROWS = 25;

interface MapProps {
  user: RefiAuthUser;
  venue: PartyMapVenue;
  selectRoom: (room: Room) => void;
}

export const Map: React.FC<MapProps> = ({ user, venue, selectRoom }) => {
  const [totalRows, setTotalRows] = useState<number>(0);
  const hasRows = totalRows > 0;

  const [mapBackground] = useValidImage(
    venue?.mapBackgroundImageUrl,
    DEFAULT_MAP_BACKGROUND
  );

  useEffect(() => {
    //@debt the image is already loaded and checked inside useValidImage
    const img = new Image();
    img.src = mapBackground ?? DEFAULT_MAP_BACKGROUND;
    img.onload = () => {
      const imgRatio = img.width ? img.width / img.height : 1;

      const calcRows = venue.columns
        ? Math.round(parseInt(venue.columns.toString()) / imgRatio)
        : DEFAULT_ROWS;

      setTotalRows(calcRows);
    };
  }, [mapBackground, venue.columns]);

  const roomOverlay = useMemo(
    () =>
      venue?.rooms
        ?.filter((room) => room.isEnabled)
        .map((room) => (
          <MapRoom
            key={room.title}
            venue={venue}
            room={room}
            selectRoom={() => {
              selectRoom(room);
            }}
          />
        )),
    [selectRoom, venue]
  );

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  return (
    <div className="party-map-map-component">
      <div className="party-map-map-content">
        <img
          width="100%"
          className="party-map-background"
          src={mapBackground}
          alt=""
        />
        {hasRows && (
          <div className="party-map-grid-container">{roomOverlay}</div>
        )}
      </div>
    </div>
  );
};
