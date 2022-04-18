import React, { useMemo } from "react";
import { useWindowSize } from "react-use";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { RefiAuthUser } from "types/fire";
import { PartyMapSpaceWithId } from "types/id";
import { Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";

import { captureAssertError } from "utils/error";
import { calculateImageDimensions } from "utils/mapPositioning";

import { useValidImage } from "hooks/image/useValidImage";

import { MapRoom } from "./MapRoom";

import styles from "./Map.module.scss";

interface PortalsProps {
  portals: Room[];
  space: PartyMapSpaceWithId;
  selectPortal: (room: Room) => void;
  safeZoneBounds: Dimensions & Position;
}

const Portals: React.FC<PortalsProps> = ({
  space,
  selectPortal,
  portals,
  safeZoneBounds,
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
          />
        )),
    [portals, safeZoneBounds, selectPortal, space]
  );
  return <div className={styles.Portals}>{portalsFragment}</div>;
};

interface MapProps {
  user: RefiAuthUser;
  venue: PartyMapSpaceWithId;
  selectRoom: (room: Room) => void;
}

export const Map: React.FC<MapProps> = ({ user, venue, selectRoom }) => {
  const url = venue?.mapBackgroundImageUrl;
  const {
    src: mapBackground,
    width: imageWidth,
    height: imageHeight,
    isLoading: isImageLoading,
  } = useValidImage(url, DEFAULT_MAP_BACKGROUND);

  const { width: windowWidth, height: browserHeight } = useWindowSize();

  const browserWidth = useMemo(() => {
    return document.body.clientWidth;
    // This is intentinonally recalculated when the browser resizes
    // This allows for optional horizontal scrollbar sizes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth]);

  // this Map might get re-rendered several times, no need for the extra noise
  useMemo(() => {
    if (isImageLoading) return null;
    if (imageWidth && imageHeight) {
      return null;
    }

    // @debt: figure out a way to incorporate this into useValidImage for all uses of the hook
    return captureAssertError({
      message: "Failed to determine image width or height",
      where: "Map",
      consoleLevel: "log",
      args: {
        imageWidth,
        imageHeight,
        mapBackground,
        url,
        DEFAULT_MAP_BACKGROUND,
      },
    });
  }, [imageWidth, imageHeight, isImageLoading, mapBackground, url]);

  if (!user || !venue || isImageLoading) {
    return <>Loading map...</>;
  }

  if (!imageWidth || !imageHeight) {
    return null;
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
      />
    </>
  );
};
