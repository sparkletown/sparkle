import React, { useMemo } from "react";
import { useWindowSize } from "react-use";

import {
  DEFAULT_MAP_BACKGROUND,
  DEFAULT_SAFE_ZONE,
  PARTY_MAP_VERTICAL_PAD,
} from "settings";

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

type CalculateImageDimensionsOptions = {
  browserWidth: number;
  browserHeight: number;
  imageWidth: number;
  imageHeight: number;
  venue: PartyMapVenue;
};

/**
 * Calculates the size that the background should be rendered at as well as
 * where the "safe zone" is after image resizing - this can then be used to
 * place portals in the right place.
 *
 * @debt It would be good if this could all live in CSS. However, there isn't
 * an obvious way to do this so it's done in JS. Performance isn't a concern
 * as calculation is only done on resize events.
 */
const calculateImageDimensions = ({
  browserWidth,
  browserHeight,
  imageWidth,
  imageHeight,
  venue,
}: CalculateImageDimensionsOptions) => {
  const { width: safeWidthPerc, height: safeHeightPerc } =
    venue.config?.safeZone || DEFAULT_SAFE_ZONE;

  // Decide whether the image needs to be rescaled using the width or the
  // height as the constraint - otherwise part of the safe zone will end up
  // off screen.
  // This is how big the safe zone is in terms of pixels in the original image
  const safeZoneWidth = safeWidthPerc * imageWidth;
  const safeZoneHeight = safeHeightPerc * imageHeight;

  // These are what the width/height would be if the width/height was used as
  // the restricting factor for scale
  const scaledWidth =
    safeZoneWidth * ((browserHeight - PARTY_MAP_VERTICAL_PAD) / safeZoneHeight);
  const scaledHeight = safeZoneHeight * (browserWidth / safeZoneWidth);

  let desiredSafezoneWidth;
  let desiredSafezoneHeight;

  if (scaledWidth > browserWidth) {
    // Use the height as the scaling factor as doing it by width would result
    // in an image that is too big
    desiredSafezoneWidth = browserWidth;
    desiredSafezoneHeight = scaledHeight;
  } else {
    // As above, but for width.
    desiredSafezoneWidth = scaledWidth;
    desiredSafezoneHeight = browserHeight - PARTY_MAP_VERTICAL_PAD;
  }

  // Now that we know what we want the safe zone to be in terms of width/height
  // we have to calculate the desired width and height for the background image
  const desiredWidth = desiredSafezoneWidth / safeWidthPerc;
  const desiredHeight = desiredSafezoneHeight / safeHeightPerc;

  // The safe zone is in the center of the image, calculate the bounds so that
  // it can be used for portals
  const safeZoneBounds = {
    left: (browserWidth - desiredSafezoneWidth) / 2,
    top: (browserHeight - desiredSafezoneHeight) / 2,
    width: desiredSafezoneWidth,
    height: desiredSafezoneHeight,
  };

  return { desiredWidth, desiredHeight, safeZoneBounds };
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
    venue,
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
