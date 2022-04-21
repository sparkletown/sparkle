import React, { RefObject, useMemo } from "react";
import { useWindowSize } from "react-use";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { RefiAuthUser } from "types/fire";
import { PartyMapSpaceWithId } from "types/id";
import { PortalWithBounds, Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";

import { calculateImageDimensions } from "utils/mapPositioning";

import { useValidImage } from "hooks/useCheckImage";

import { MapPortal } from "./MapPortal";

import styles from "./Map.module.scss";

interface PortalsProps {
  portals: Room[];
  space: PartyMapSpaceWithId;
  selectPortal: (portal: Room) => void;
  safeZoneBounds: Dimensions & Position;
  portalRef: RefObject<HTMLDivElement> | null;
  selectedPortal?: Room;
  unselectPortal: () => void;
}

const Portals: React.FC<PortalsProps> = ({
  space,
  selectPortal,
  portals,
  safeZoneBounds,
  portalRef,
  selectedPortal,
  unselectPortal,
}) => {
  const portalsFragment = useMemo(
    () =>
      portals
        .filter((portal) => portal.isEnabled)
        .map((portal) => (
          <MapPortal
            key={portal.title}
            space={space}
            portal={portal}
            selectPortal={() => {
              selectPortal(portal);
            }}
            safeZoneBounds={safeZoneBounds}
            portalRef={portalRef}
            selectedPortal={selectedPortal}
            unselectPortal={unselectPortal}
          />
        )),
    [
      portals,
      safeZoneBounds,
      selectPortal,
      space,
      selectedPortal,
      portalRef,
      unselectPortal,
    ]
  );
  return <div className={styles.Portals}>{portalsFragment}</div>;
};

interface MapProps {
  user: RefiAuthUser;
  venue: PartyMapSpaceWithId;
  selectPortal: (portal: PortalWithBounds) => void;
  portalRef: RefObject<HTMLDivElement> | null;
  selectedPortal?: Room;
  unselectPortal: () => void;
}

export const Map: React.FC<MapProps> = ({
  user,
  unselectPortal,
  venue,
  selectPortal,
  portalRef,
  selectedPortal,
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

  const handleSelectPortal = (portal: Room) =>
    selectPortal({ ...portal, bounds: safeZoneBounds });

  return (
    <>
      <div className={styles.MapBackground} style={mapStyles} />
      <Portals
        portals={venue.rooms ?? []}
        space={venue}
        selectPortal={handleSelectPortal}
        safeZoneBounds={safeZoneBounds}
        portalRef={portalRef}
        selectedPortal={selectedPortal}
        unselectPortal={unselectPortal}
      />
    </>
  );
};
