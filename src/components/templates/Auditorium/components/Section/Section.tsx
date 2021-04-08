import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import {
  useAuditoriumSection,
  useAuditoriumGrid,
} from "hooks/auditoriumSections";

import { IFrame } from "components/atoms/IFrame";

import {
  SECTION_DEFAULT_COLUMNS_NUMBER,
  SECTION_DEFAULT_ROWS_NUMBER,
  SECTION_VIDEO_MIN_WIDTH_IN_SEATS,
} from "settings";

import "./Section.scss";

// If you change this, make sure to also change it in Section.scss
export const SECTION_SEAT_SIZE = "var(--section-seat-size)";
export const SECTION_SEAT_SIZE_MIN = "var(--section-seat-size-min)";
export const SECTION_SEAT_SPACING = "var(--section-seat-spacing)";

export interface SectionProps {
  venue: WithId<AnyVenue>;
}

export const Section: React.FC<SectionProps> = ({ venue }) => {
  const {
    iframeUrl,
    rows = SECTION_DEFAULT_ROWS_NUMBER,
    columns = SECTION_DEFAULT_COLUMNS_NUMBER,
    id: venueId,
  } = venue;

  const { sectionId } = useParams<{ sectionId?: string }>();

  // Video takes 1/3 of the seats
  const videoWidthInSeats = Math.max(
    Math.floor(columns / 3),
    SECTION_VIDEO_MIN_WIDTH_IN_SEATS
  );

  // Keep the 16:9 ratio
  const videoHeightInSeats = Math.ceil(videoWidthInSeats * (9 / 16));

  const {
    auditoriumSection,
    getUserBySeat,
    takeSeat,
    leaveSeat,
    checkIfSeat,
  } = useAuditoriumSection({
    venueId,
    sectionId,
    rows,
    columns,
    videoWidthInSeats,
    videoHeightInSeats,
  });

  // Ensure the user leaves their seat when they leave the section
  // @debt We should handle/enforce this on the backend somehow
  useEffect(() => {
    return () => {
      leaveSeat();
    };
  }, [leaveSeat]);

  const iframeInlineStyles: React.CSSProperties = useMemo(
    () => ({
      width: `calc(${videoWidthInSeats} * (${SECTION_SEAT_SIZE} + (${SECTION_SEAT_SPACING} * 2)))`,
      height: `calc(${videoHeightInSeats} * (${SECTION_SEAT_SIZE} + (${SECTION_SEAT_SPACING} * 2)))`,
      minWidth: `calc(${videoWidthInSeats} * (${SECTION_SEAT_SIZE_MIN} + (${SECTION_SEAT_SPACING} * 2)))`,
      minHeight: `calc(${videoHeightInSeats} * (${SECTION_SEAT_SIZE_MIN} + (${SECTION_SEAT_SPACING} * 2)))`,
    }),
    [videoWidthInSeats, videoHeightInSeats]
  );

  const seatsGrid = useAuditoriumGrid({
    rows,
    columns,
    checkIfSeat,
    getUserBySeat,
    takeSeat,
  });

  if (!auditoriumSection) return <p>The section id is invalid</p>;

  return (
    <div className="section">
      <div className="section__seats">
        <IFrame
          containerClassname="section__iframe-overlay"
          iframeClassname="section__iframe"
          iframeStyles={iframeInlineStyles}
          src={iframeUrl}
        />
        {seatsGrid}
      </div>
    </div>
  );
};
