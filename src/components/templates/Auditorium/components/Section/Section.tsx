import React, { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { translateIndex } from "utils/auditorium";

import { useAuditoriumSection } from "hooks/auditoriumSections";
import { useVenueId } from "hooks/useVenueId";

import UserProfilePicture from "components/molecules/UserProfilePicture";

import { Video } from "../Video";

import {
  DEFAULT_COLUMNS_NUMBER,
  DEFAULT_ROWS_NUMBER,
  SEAT_SIZE,
  SEAT_SIZE_MIN,
  SEAT_SPACING,
  VIDEO_MIN_WIDTH_IN_SEATS,
} from "./constants";

import "./Section.scss";

export interface SectionProps {
  venue: AuditoriumVenue;
}

export const Section: React.FC<SectionProps> = ({ venue }) => {
  const {
    iframeUrl,
    rows = DEFAULT_ROWS_NUMBER,
    columns = DEFAULT_COLUMNS_NUMBER,
  } = venue;

  const { sectionId } = useParams<{ sectionId: string }>();
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

  // NOTE: Video takes 1/3 of the seats
  const videoWidthInSeats = Math.max(Math.floor(columns / 3), VIDEO_MIN_WIDTH_IN_SEATS);

  // NOTE: Keep the 16:9 ratio
  const videoHeightInSeats = Math.ceil(videoWidthInSeats * (9 / 16));

  const checkIfSeat = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const translatedRowIndex = translateIndex({
        index: rowIndex,
        totalAmount: rows,
      });
      const translatedColumnIndex = translateIndex({
        index: columnIndex,
        totalAmount: columns,
      });

      const isInVideoRow =
        Math.abs(translatedRowIndex) <= videoHeightInSeats / 2;
      const isInVideoColumn =
        Math.abs(translatedColumnIndex) <= videoWidthInSeats / 2;

      return !(isInVideoRow && isInVideoColumn);
    },
    [rows, columns, videoHeightInSeats, videoWidthInSeats]
  );

  // Ensure the user leaves their seat when they leave the section
  // @debt We should handle/enforce this on the backend somehow
  useEffect(() => {
    return () => {
      leaveSeat();
    };
  }, [leaveSeat]);

  const iframeInlineStyles = useMemo(
    () => ({
      width: `calc(${videoWidthInSeats} * (${SEAT_SIZE} + ${SEAT_SPACING}))`,
      height: `calc(${videoHeightInSeats} * (${SEAT_SIZE} + ${SEAT_SPACING}))`,
      minWidth: `calc(${videoWidthInSeats} * (${SEAT_SIZE_MIN} + ${SEAT_SPACING}))`,
      minHeight: `calc(${videoHeightInSeats} * (${SEAT_SIZE_MIN} + ${SEAT_SPACING}))`,
    }),
    [videoWidthInSeats, videoHeightInSeats]
  );

  if (!auditoriumSection) return <p>The section id is invalid</p>;

  return (
    <div className="section">
      <div className="section__seats">
        <Video
          overlayClassname="section__video-overlay"
          iframeClassname="section__video"
          iframeStyles={iframeInlineStyles}
          src={iframeUrl}
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
