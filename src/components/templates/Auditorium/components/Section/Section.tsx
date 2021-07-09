import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import classNames from "classnames";

import { AuditoriumVenue } from "types/venues";
import { EmojiReactions } from "types/reactions";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useAuditoriumSection, useAuditoriumGrid } from "hooks/auditorium";
import { useUser } from "hooks/useUser";

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
  const { userWithId } = useUser();
  const [isAudioEffectDisabled, setIsAudioEffectDisabled] = useState(false);
  const toggleMute = useCallback(
    () => setIsAudioEffectDisabled((state) => !state),
    []
  );

  const { iframeUrl, id: venueId } = venue;

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
    isAudioEffectDisabled,
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

  const renderInstructions = () => (
    <div className="instructions">
      Welcome! Click on an empty seat to claim it!
    </div>
  );

  if (!auditoriumSection) return <p>The section id is invalid</p>;

  const userSeated =
    typeof userWithId?.data?.[venue.id]?.row === "number" &&
    typeof userWithId?.data?.[venue.id]?.row === "number";

  const reactionContainerClassnames = classNames(
    "Section__reactions-container",
    {
      seated: userSeated,
    }
  );

  return (
    <div className="Section">
      <BackButton onClick={backToMain} locationName="overview" />
      <div className="Section__seats">
        <IFrame
          containerClassname="Section__iframe-overlay"
          iframeClassname="Section__iframe"
          iframeInlineStyles={iframeInlineStyles}
          src={iframeUrl}
        />
        <div className={reactionContainerClassnames}>
          {userSeated ? (
            <ReactionsBar
              reactions={EmojiReactions}
              venueId={venueId}
              leaveSeat={leaveSeat}
              isAudioEffectDisabled={isAudioEffectDisabled}
              handleMute={toggleMute}
            />
          ) : (
            renderInstructions()
          )}
        </div>
        {seatsGrid}
      </div>
    </div>
  );
};
