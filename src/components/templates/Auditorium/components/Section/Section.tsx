import React, { useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useAuditoriumSection, useAuditoriumGrid } from "hooks/auditorium";
import { useShowHide } from "hooks/useShowHide";

import { ReactionsBar } from "components/molecules/ReactionsBar";

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
  const { isShown: isUserAudioOn, toggle: toggleUserAudio } = useShowHide(true);

  const isUserAudioMuted = !isUserAudioOn;

  const { iframeUrl, id: venueId } = venue;

  const { sectionId } = useParams<{ sectionId?: string }>();
  const { push: openUrlUsingRouter } = useHistory();

  const {
    auditoriumSection,

    baseRowsCount,
    baseColumnsCount,

    screenHeightInSeats,
    screenWidthInSeats,

    isUserSeated,

    getUserBySeat,
    takeSeat,
    leaveSeat,
    checkIfSeat,
  } = useAuditoriumSection({
    venue,
    sectionId,
  });

  // Ensure the user leaves their seat when they leave the section
  // @debt We should handle/enforce this on the backend somehow
  useEffect(() => {
    return () => {
      leaveSeat();
    };
  }, [leaveSeat]);

  const centralScreenInlineStyles: React.CSSProperties = useMemo(
    () => ({
      width: `calc(${screenWidthInSeats} * (${SECTION_SEAT_SIZE} + ${SECTION_SEAT_SPACING}))`,
      height: `calc(${screenHeightInSeats} * (${SECTION_SEAT_SIZE} + ${SECTION_SEAT_SPACING}))`,
      minWidth: `calc(${screenWidthInSeats} * (${SECTION_SEAT_SIZE_MIN} + ${SECTION_SEAT_SPACING}))`,
      minHeight: `calc(${screenHeightInSeats} * (${SECTION_SEAT_SIZE_MIN} + ${SECTION_SEAT_SPACING}))`,
    }),
    [screenWidthInSeats, screenHeightInSeats]
  );

  const seatsGrid = useAuditoriumGrid({
    isUserAudioMuted,
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
        <div className="Section__central-screen-overlay">
          <div
            className="Section__central-screen"
            style={centralScreenInlineStyles}
          >
            <IFrame containerClassname="Section__iframe" src={iframeUrl} />
            <div className="Section__reactions">
              {isUserSeated ? (
                <ReactionsBar
                  venueId={venueId}
                  leaveSeat={leaveSeat}
                  isReactionsMuted={isUserAudioMuted}
                  toggleMute={toggleUserAudio}
                />
              ) : (
                "Welcome! Click on an empty seat to claim it!"
              )}
            </div>
          </div>
        </div>
        {seatsGrid}
      </div>
    </div>
  );
};
