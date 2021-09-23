import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { useCss } from "react-use";
import classNames from "classnames";

import { AuditoriumVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useAuditoriumGrid, useAuditoriumSection } from "hooks/auditorium";
import { useSettings } from "hooks/useSettings";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";

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

  const { sectionId } = useParams<{ sectionId: string }>();
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

  const seatedUserData = {
    venueId,
    template: VenueTemplate.auditorium,
    venueSpecificData: { sectionId },
  };

  useUpdateRecentSeatedUsers(isUserSeated ? seatedUserData : undefined);

  const { isLoaded: areSettingsLoaded, settings } = useSettings();

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

  const shouldShowReactions = areSettingsLoaded && settings.showReactions;

  const renderReactions = () => {
    return (
      shouldShowReactions && (
        <div className="Section__reactions">
          <ReactionsBar
            venueId={venueId}
            leaveSeat={leaveSeat}
            isReactionsMuted={isUserAudioMuted}
            toggleMute={toggleUserAudio}
          />
        </div>
      )
    );
  };

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
          <div className={centralScreenClasses}>
            <IFrame containerClassName="Section__iframe" src={iframeUrl} />
            {isUserSeated ? (
              renderReactions()
            ) : (
              <div className="Section__reactions">
                Welcome! Click on an empty seat to claim it!
              </div>
            )}
          </div>
        </div>
        {seatsGrid}
      </div>
    </div>
  );
};
