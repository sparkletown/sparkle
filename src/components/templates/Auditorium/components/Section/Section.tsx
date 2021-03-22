import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { useAuditoriumSection } from "hooks/auditoriumSections";

import { Video } from "../Video";

import "./Section.scss";
import { useVenueId } from "hooks/useVenueId";
import UserProfilePicture from "components/molecules/UserProfilePicture";

const DEFAULT_ROWS_NUMBER = 17;
const DEFAULT_COLUMNS_NUMBER = 23;

const VIDEO_MIN_WIDTH_IN_SEATS = 17;

// If you change this, make sure to also change it in Audience.scss's $seat-size
const SEAT_SIZE = "var(--seat-size)";
const SEAT_SIZE_MIN = "var(--seat-size-min)";
const SEAT_SPACING = "var(--seat-spacing)";

// NOTE: Video should take third of the columns
const videoWidthInSeats = Math.max(
  Math.floor(DEFAULT_COLUMNS_NUMBER / 3),
  VIDEO_MIN_WIDTH_IN_SEATS
);

// Keep a 16:9 ratio
const videoHeightInSeats = Math.ceil(videoWidthInSeats * (9 / 16));

const translateIndex = (index: number, totalAmount: number) =>
  index - Math.floor(totalAmount / 2);

const checkIfSeat = (rowIndex: number, columnIndex: number) => {
  const translatedRowIndex = translateIndex(rowIndex, DEFAULT_ROWS_NUMBER);
  const translatedColumnIndex = translateIndex(
    columnIndex,
    DEFAULT_COLUMNS_NUMBER
  );

  const isInVideoRow = Math.abs(translatedRowIndex) <= videoHeightInSeats / 2;
  const isInVideoColumn =
    Math.abs(translatedColumnIndex) <= videoWidthInSeats / 2;

  return !(isInVideoRow && isInVideoColumn);
};

export interface SectionProps {
  venue: AuditoriumVenue;
}

export const Section: React.FC<SectionProps> = ({ venue }) => {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const venueId = useVenueId();

  const {
    auditoriumSection,
    getUserBySeat,
    takeSeat,
    leaveSeat,
  } = useAuditoriumSection({
    venueId,
    sectionId,
  });

  useEffect(() => {
    return () => {
      leaveSeat();
    };
  }, []);

  const iframeInlineStyles = useMemo(
    () => ({
      width: `calc(${videoWidthInSeats} * (${SEAT_SIZE} + ${SEAT_SPACING}))`,
      height: `calc(${videoHeightInSeats} * (${SEAT_SIZE} + ${SEAT_SPACING}))`,
      minWidth: `calc(${videoWidthInSeats} * (${SEAT_SIZE_MIN} + ${SEAT_SPACING}))`,
      minHeight: `calc(${videoHeightInSeats} * (${SEAT_SIZE_MIN} + ${SEAT_SPACING}))`,
    }),
    []
  );

  if (!auditoriumSection) return <p>No such section was found</p>;

  return (
    <div className="section">
      <div className="section__seats">
        <Video
          overlayClassname="section__video-overlay"
          iframeClassname="section__video"
          iframeStyles={iframeInlineStyles}
          src={venue.iframeUrl}
        />
        {Array.from(Array(DEFAULT_ROWS_NUMBER)).map((_, rowIndex) => (
          <div key={rowIndex} className="section__seats-row">
            {Array.from(Array(DEFAULT_COLUMNS_NUMBER)).map((_, columnIndex) => {
              const user = getUserBySeat({
                row: rowIndex,
                column: columnIndex,
              });

              if (user) {
                return (
                  <UserProfilePicture
                    user={user}
                    avatarClassName={"section__user-avatar"}
                    setSelectedUserProfile={() => {}}
                  />
                );
              }

              const isSeat = checkIfSeat(rowIndex, columnIndex);

              if (isSeat) {
                return (
                  <div
                    key={columnIndex}
                    className="section__seat"
                    onClick={() =>
                      takeSeat({ row: rowIndex, column: columnIndex })
                    }
                  >
                    +
                  </div>
                );
              }

              return (
                <div key={columnIndex} className="section__empty-circle" />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
