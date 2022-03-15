/*
 * Utilities for determining where on a map a portal should be based on
 * safe zones and percentages passed as 0-100 ranges.
 * Historically, Sparkle used 0-100 to store percentages and migrating them
 * all would be more effort than just casting them here.
 *
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

import { DEFAULT_SAFE_ZONE, PARTY_MAP_VERTICAL_PAD } from "settings";

import { Dimensions } from "types/utility";
import { SafeZone } from "types/venues";

type CalculateImageDimensionsOptions = {
  browserWidth: number;
  browserHeight: number;
  imageWidth: number;
  imageHeight: number;
  safeZone?: SafeZone;
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
export const calculateImageDimensions = ({
  browserWidth,
  browserHeight,
  imageWidth,
  imageHeight,
  safeZone = DEFAULT_SAFE_ZONE,
}: CalculateImageDimensionsOptions) => {
  const { width: safeWidthPerc100, height: safeHeightPerc100 } =
    safeZone || DEFAULT_SAFE_ZONE;

  // All percentages are stored as 0-100 in the database for historical reasons
  // and so we scale them here.
  const safeWidthPerc = safeWidthPerc100 / 100.0;
  const safeHeightPerc = safeHeightPerc100 / 100.0;

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

export const convertDisplayedCoordToIntrinsic = (
  val: number,
  imageDims: Dimensions,
  dimension: keyof Dimensions,
  safeZoneDimension: number
) => {
  const imageDim = imageDims[dimension];
  return (
    100 *
    ((val - imageDim * ((1 - safeZoneDimension) / 2)) /
      (imageDim * safeZoneDimension))
  );
};

interface SizeAndPosition {
  width: number;
  height: number;
  top: number;
  left: number;
}

type ConvertRelativePxToPercOptions = {
  rect: SizeAndPosition;
  imageDims: Dimensions;
  safeZonePerc: SafeZone;
};

/**
 * Converts relative pixel positioning/sizing into percentages
 */
export const convertRelativePxToPerc = ({
  rect,
  imageDims,
  // Safe zone as a 0-1 percetange
  safeZonePerc,
}: ConvertRelativePxToPercOptions) => ({
  width: (100 * rect.width) / (imageDims.width * safeZonePerc.width),
  height: (100 * rect.height) / (imageDims.height * safeZonePerc.height),
  top: convertDisplayedCoordToIntrinsic(
    rect.top,
    imageDims,
    "height",
    safeZonePerc.height
  ),
  left: convertDisplayedCoordToIntrinsic(
    rect.left,
    imageDims,
    "width",
    safeZonePerc.width
  ),
});

type ConvertPercToRelativePxOptions = {
  rect: SizeAndPosition;
  imageDims: Dimensions;
  safeZonePerc: SafeZone;
};
/**
 * Converts percentage (0-1) based sizing into relative pixels.
 */
export const convertPercToRelativePx = ({
  rect,
  imageDims,
  safeZonePerc,
}: ConvertPercToRelativePxOptions) => ({
  width: imageDims.width * rect.width * safeZonePerc.width,
  height: imageDims.height * rect.height * safeZonePerc.height,
  top:
    imageDims.height * ((1 - safeZonePerc.height) / 2) +
    imageDims.height * rect.top * safeZonePerc.height,
  left:
    imageDims.width * ((1 - safeZonePerc.width) / 2) +
    imageDims.width * rect.left * safeZonePerc.width,
});
