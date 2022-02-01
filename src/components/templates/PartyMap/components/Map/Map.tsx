import React, { useMemo } from "react";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { RefiAuthUser } from "types/fire";
import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import { useValidImage } from "hooks/useCheckImage";

import { MapRoom } from "./MapRoom";

import styles from "./Map.module.scss";

interface MapTitleProps {
  title: string;
}

const MapTitle: React.FC<MapTitleProps> = ({ title }) => {
  const titleParts = useMemo(
    () => title.split(" ").map((part, idx) => <span key={idx}>{part}</span>),
    [title]
  );
  return <h1 className={styles.MapTitle}>{titleParts}</h1>;
};

interface PortalsProps {
  portals: Room[];
  space: PartyMapVenue;
  selectPortal: (room: Room) => void;
}

const Portals: React.FC<PortalsProps> = ({ space, selectPortal, portals }) => {
  const portalsFragment = useMemo(
    () =>
      portals
        .filter((portal) => portal.isEnabled)
        .map((portal) => (
          <MapRoom
            key={portal.title}
            venue={space}
            room={portal}
            selectRoom={() => {
              selectPortal(portal);
            }}
          />
        )),
    [portals, selectPortal, space]
  );
  return <div className={styles.Portals}>{portalsFragment}</div>;
};

interface MapProps {
  user: RefiAuthUser;
  venue: PartyMapVenue;
  selectRoom: (room: Room) => void;
}

export const Map: React.FC<MapProps> = ({ user, venue, selectRoom }) => {
  const [mapBackground] = useValidImage(
    venue?.mapBackgroundImageUrl,
    DEFAULT_MAP_BACKGROUND
  );

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  const mapStyles = {
    backgroundImage: `url(${mapBackground})`,
  };

  return (
    <>
      <div className={styles.MapBackground} style={mapStyles} />
      <MapTitle title={venue.name} />
      <Portals
        portals={venue.rooms ?? []}
        space={venue}
        selectPortal={selectRoom}
      />
    </>
  );
};
