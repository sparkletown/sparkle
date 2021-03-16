import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { useAuditoriumSection } from "hooks/auditoriumSections";

import { Video } from "../Video";

import "./Section.scss";
import { useVenueId } from "hooks/useVenueId";

const ROWS = 20;
const COLUMNS = 25;

// If you change this, make sure to also change it in Audience.scss's $seat-size
const SEAT_SIZE = "var(--seat-size)";
const SEAT_SIZE_MIN = "var(--seat-size-min)";

const VIDEO_MIN_WIDTH_IN_SEATS = 8;
// We should keep the 16/9 ratio
const VIDEO_MIN_HEIGHT_IN_SEATS = VIDEO_MIN_WIDTH_IN_SEATS * (9 / 16);

// We use 3 because 1/3 of the size of the auditorium, and * 2 because we're calculating in halves due to using cartesian coordinates + Math.abs
const carvedOutWidthInSeats = Math.max(
  Math.ceil(COLUMNS / (3 * 2)),
  VIDEO_MIN_WIDTH_IN_SEATS
);

// Keep a 16:9 ratio
const carvedOutHeightInSeats = Math.max(
  Math.ceil(carvedOutWidthInSeats * (9 / 16)),
  VIDEO_MIN_HEIGHT_IN_SEATS
);

// Calculate the position/size for the central video container
const videoContainerWidthInSeats = carvedOutWidthInSeats * 2 + 1;
const videoContainerHeightInSeats = carvedOutHeightInSeats * 2 + 1;

const translateRow = (untranslatedRowIndex: number) =>
  untranslatedRowIndex - Math.floor(ROWS / 2);

const translateColumn = (untranslatedColumnIndex: number) =>
  untranslatedColumnIndex - Math.floor(COLUMNS / 2);

export interface SectionProps {
  venue: AuditoriumVenue;
}

export const Section: React.FC<SectionProps> = () => {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const venueId = useVenueId();

  const section = useAuditoriumSection({ venueId, sectionId });

  const isSeat = useCallback(
    (translatedRow: number, translatedColumn: number) => {
      const isInFireLaneColumn = translatedColumn === 0;
      if (isInFireLaneColumn) return false;

      const isInVideoRow = Math.abs(translatedRow) <= carvedOutHeightInSeats;
      const isInVideoColumn =
        Math.abs(translatedColumn) <= carvedOutWidthInSeats;

      const isInVideoCarveOut = isInVideoRow && isInVideoColumn;

      return !isInVideoCarveOut;
    },
    [carvedOutWidthInSeats, carvedOutHeightInSeats]
  );

  const videoContainerStyles = useMemo(
    () => ({
      width: `calc(${videoContainerWidthInSeats} * ${SEAT_SIZE})`,
      height: `calc(${videoContainerHeightInSeats} * ${SEAT_SIZE})`,
      minWidth: `calc(${videoContainerWidthInSeats} * ${SEAT_SIZE_MIN})`,
      minHeight: `calc(${videoContainerHeightInSeats} * ${SEAT_SIZE_MIN})`,
    }),
    [videoContainerHeightInSeats, videoContainerWidthInSeats]
  );

  if (!section) return <p>No such section was found</p>;

  return (
    <div className="audience-container">
      <div className="audience">
        <Video
          overlayClassname="audience-overlay"
          iframeClassname="video-container"
          iframeStyles={videoContainerStyles}
        />
        {Array.from(Array(ROWS)).map((_, untranslatedRowIndex) => {
          const row = translateRow(untranslatedRowIndex);
          return (
            <div key={untranslatedRowIndex} className="seat-row">
              {Array.from(Array(COLUMNS)).map((_, untranslatedColumnIndex) => {
                const column = translateColumn(untranslatedColumnIndex);
                const seat = isSeat(row, column);

                return (
                  <div
                    key={untranslatedColumnIndex}
                    className={seat ? "seat" : "not-seat"}
                  >
                    {seat && <>+</>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
