import React, { useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import {
  useAuditoriumSection,
  useAuditoriumGrid,
} from "hooks/auditoriumSections";

import { BackButton } from "components/atoms/BackButton";
import { IFrame } from "components/atoms/IFrame";

import "./Section.scss";

// If you change this, make sure to also change it in Section.scss
export const SECTION_SEAT_SIZE = "var(--section-seat-size)";
export const SECTION_SEAT_SIZE_MIN = "var(--section-seat-size-min)";
export const SECTION_SEAT_SPACING = "var(--section-seat-spacing)";

export interface SectionProps {
  venue: WithId<AuditoriumVenue>;
}

export const Section: React.FC<SectionProps> = ({ venue }) => {
  const {
    iframeUrl,
    rows: venueRowsCount,
    columns: venueColumnsCount,
    id: venueId,
  } = venue;

  const { sectionId } = useParams<{ sectionId?: string }>();
  const { push: openUrlUsingRouter } = useHistory();

  const {
    auditoriumSection,

    baseRowsCount,
    baseColumnsCount,

    videoWidthInSeats,
    videoHeightInSeats,

    getUserBySeat,
    takeSeat,
    leaveSeat,
    checkIfSeat,
  } = useAuditoriumSection({
    venueId,
    sectionId,
    venueRowsCount,
    venueColumnsCount,
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
      width: `calc(${videoWidthInSeats} * (${SECTION_SEAT_SIZE} + ${SECTION_SEAT_SPACING}))`,
      height: `calc(${videoHeightInSeats} * (${SECTION_SEAT_SIZE} + ${SECTION_SEAT_SPACING}))`,
      minWidth: `calc(${videoWidthInSeats} * (${SECTION_SEAT_SIZE_MIN} + ${SECTION_SEAT_SPACING}))`,
      minHeight: `calc(${videoHeightInSeats} * (${SECTION_SEAT_SIZE_MIN} + ${SECTION_SEAT_SPACING}))`,
    }),
    [videoWidthInSeats, videoHeightInSeats]
  );

  const seatsGrid = useAuditoriumGrid({
    rows: baseRowsCount,
    columns: baseColumnsCount,
    checkIfSeat,
    getUserBySeat,
    takeSeat,
  });

  const backToMain = useCallback(() => {
    if (!venueId) return;

    enterVenue(venueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [venueId, openUrlUsingRouter]);

  if (!auditoriumSection) return <p>The section id is invalid</p>;

  return (
    <div className="Section">
      <BackButton onClick={backToMain} locationName="overview" />
      <div className="Section__seats">
        <IFrame
          containerClassname="Section__iframe-overlay"
          iframeClassname="Section__iframe"
          iframeStyles={iframeInlineStyles}
          src={iframeUrl}
        />
        {seatsGrid}
      </div>
    </div>
  );
};
