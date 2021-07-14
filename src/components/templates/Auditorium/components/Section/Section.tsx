import React, { useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import classNames from "classnames";
import { useCss } from "react-use";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useAuditoriumSection, useAuditoriumGrid } from "hooks/auditorium";
import { useShowHide } from "hooks/useShowHide";

import { ReactionsBar } from "components/molecules/ReactionsBar";

import { BackButton } from "components/atoms/BackButton";
import { IFrame } from "components/atoms/IFrame";

import "./Section.scss";

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

  const centralScreenVars = useCss({
    "--central-screen-width-in-seats": screenWidthInSeats,
    "--central-screen-height-in-seats": screenHeightInSeats,
  });

  const centralScreenClasses = classNames(
    "Section__central-screen",
    centralScreenVars
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
      <BackButton onClick={backToMain} />
      <div className="Section__seats">
        <div className="Section__central-screen-overlay">
          <div className={centralScreenClasses}>
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
