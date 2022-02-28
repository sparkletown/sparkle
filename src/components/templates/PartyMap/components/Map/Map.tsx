import React, { useMemo } from "react";
import { useWindowSize } from "react-use";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { RefiAuthUser } from "types/fire";
import { Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";
import { PartyMapVenue } from "types/venues";

import { useValidImage } from "hooks/useCheckImage";

import { MapRoom } from "./MapRoom";

import styles from "./Map.module.scss";
interface PortalsProps {
  portals: Room[];
  space: PartyMapVenue;
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
  venue: PartyMapVenue;
  selectRoom: (room: Room) => void;
}

/**
 * The party map is an image with portals arranged over it at specific points.
 * To maximise immersion there should be as little reliance on black bars when
 * the image resizes due to browser size changes. To achieve this the image has
 * a safe zone in the centre that is *always* visible and the bits outside the
 * safe will come into the view as needed. If the browser resizes too much then
 * black borders will be relied upon.
 *
 * e.g. in a browser that is taller than it is wide:
 *
 * B = the browser window.
 *
 *            #--------------BBBBBBBBBBBBBBBBBBBBBBB--------------#
 *            |  Total image B Visible portion     B              |
 *            |              B inside browser      B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B---------------------B              |
 *            |              B                     B              |
 *            |              B Area where portals  B              |
 *            |              B appear.             B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B---------------------B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            |              B                     B              |
 *            #--------------BBBBBBBBBBBBBBBBBBBBBBB--------------#
 *
 * The central area is called the "safe zone". This must always be visible.
 * Portals are positioned so that they appear to be fixed to the image.
 */
export const Map: React.FC<MapProps> = ({ user, venue, selectRoom }) => {
  const [
    mapBackground,
    { width: imageWidth, height: imageHeight },
  ] = useValidImage(venue?.mapBackgroundImageUrl, DEFAULT_MAP_BACKGROUND);

  const { width: _browserWidth, height: browserHeight } = useWindowSize();

  const browserWidth = useMemo(() => {
    return document.body.clientWidth;
    // This is intentinonally recalculated when the browser resizes
    // This allows for optional horizontal scrollbar sizes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_browserWidth]);

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  if (!imageWidth || !imageHeight) {
    // TODO Tidy thisup
    console.error("Failed to get image width/height");
    return <>Error</>;
  }

  const { width: safeWidthPerc, height: safeHeightPerc } = venue.config
    ?.safeZone || {
    width: 1.0,
    height: 1.0,
  };

  // TODO Account for height of top and bottom nav

  const verticalPad = 140; // 70px for top and bottom

  // Figure out if the image should be rescaled using the width or height as
  // a basis
  const safeZoneWidth = safeWidthPerc * imageWidth;
  const safeZoneHeight = safeHeightPerc * imageHeight;

  const _scaledWidth =
    safeZoneWidth * ((browserHeight - verticalPad) / safeZoneHeight);
  const _scaledHeight = safeZoneHeight * (browserWidth / safeZoneWidth);

  let desiredSafezoneWidth = 1;
  let desiredSafezoneHeight = 1;

  if (_scaledWidth > browserWidth) {
    // Use width
    desiredSafezoneWidth = browserWidth;
    desiredSafezoneHeight = _scaledHeight;
  } else {
    desiredSafezoneWidth = _scaledWidth;
    desiredSafezoneHeight = browserHeight - verticalPad;
  }

  const desiredWidth = desiredSafezoneWidth / safeWidthPerc;
  const desiredHeight = desiredSafezoneHeight / safeHeightPerc;

  const safeZoneBounds = {
    left: (browserWidth - desiredSafezoneWidth) / 2,
    top: (browserHeight - desiredSafezoneHeight) / 2,
    width: desiredSafezoneWidth,
    height: desiredSafezoneHeight,
  };

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
