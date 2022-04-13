import React, { useMemo } from "react";
import { useWindowSize } from "react-use";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { RefiAuthUser } from "types/fire";
import { Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";
import { PartyMapVenue } from "types/venues";

import { calculateImageDimensions } from "utils/mapPositioning";

import { useValidImage } from "hooks/useCheckImage";

import { MapRoom } from "./MapRoom";

import styles from "./Map.module.scss";
interface PortalsProps {
  portals: Room[];
  space: PartyMapVenue;
  selectPortal: (room: Room) => void;
  safeZoneBounds: Dimensions & Position;
  setRoomRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  selectedRoom?: Room;
  unselectRoom: () => void;
}

const Portals: React.FC<PortalsProps> = ({
  space,
  selectPortal,
  portals,
  safeZoneBounds,
  setRoomRef,
  selectedRoom,
  unselectRoom,
}) => {
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
            safeZoneBounds={safeZoneBounds}
            setRoomRef={setRoomRef}
            selectedRoom={selectedRoom}
            unselectRoom={unselectRoom}
          />
        )),
    [
      portals,
      safeZoneBounds,
      selectPortal,
      space,
      selectedRoom,
      setRoomRef,
      unselectRoom,
    ]
  );
  return <div className={styles.Portals}>{portalsFragment}</div>;
};
interface MapProps {
  user: RefiAuthUser;
  venue: PartyMapVenue;
  selectRoom: (room: Room) => void;
  setRoomRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  selectedRoom?: Room;
  unselectRoom: () => void;
}

export const Map: React.FC<MapProps> = ({
  user,
  unselectRoom,
  venue,
  selectRoom,
  setRoomRef,
  selectedRoom,
}) => {
  const [
    mapBackground,
    { width: imageWidth, height: imageHeight, isLoading: isImageLoading },
  ] = useValidImage(venue?.mapBackgroundImageUrl, DEFAULT_MAP_BACKGROUND);

  const { width: windowWidth, height: browserHeight } = useWindowSize();

  const browserWidth = useMemo(() => {
    return document.body.clientWidth;
    // This is intentinonally recalculated when the browser resizes
    // This allows for optional horizontal scrollbar sizes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth]);

  if (!user || !venue || isImageLoading) {
    return <>Loading map...</>;
  }

  if (!imageWidth || !imageHeight) {
    console.error("Failed to get image width/height");
    return <>Failed to get image width/height</>;
  }

  const {
    desiredWidth,
    desiredHeight,
    safeZoneBounds,
  } = calculateImageDimensions({
    browserWidth,
    browserHeight,
    imageWidth,
    imageHeight,
    safeZone: venue.config?.safeZone,
  });

  const mapStyles = {
    backgroundImage: `url(${mapBackground})`,
    backgroundSize: `${desiredWidth}px ${desiredHeight}px`,
  };

  return (
    <>
      <div className={styles.MapBackground} style={mapStyles} />
      <Portals
        portals={venue.rooms ?? []}
        space={venue}
        selectPortal={selectRoom}
        safeZoneBounds={safeZoneBounds}
        setRoomRef={setRoomRef}
        selectedRoom={selectedRoom}
        unselectRoom={unselectRoom}
      />
    </>
  );
};
