import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { useCss } from "react-use";
import classNames from "classnames";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useAuditoriumGrid, useAuditoriumSection } from "hooks/auditorium";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUpdateAuditoriumRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";

import { Loading } from "components/molecules/Loading";
import { ReactionsBar } from "components/molecules/ReactionsBar";

import { BackButton } from "components/atoms/BackButton";
import { IFrame } from "components/atoms/IFrame";
import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import "./Section.scss";

export interface SectionProps {
  venue: WithId<AuditoriumVenue>;
}

export const Section: React.FC<SectionProps> = ({ venue }) => {
  const { isShown: isUserAudioOn, toggle: toggleUserAudio } = useShowHide(
    venue.isReactionsMuted ?? false
  );

  const { parentVenue } = useRelatedVenues({
    currentVenueId: venue.id,
  });
  const parentVenueId = parentVenue?.id;

  const isUserAudioMuted = !isUserAudioOn;

  const { iframeUrl, id: venueId } = venue;

  const { sectionId } = useParams<{ sectionId: string }>();
  const {
    push: openUrlUsingRouter,
    replace: replaceUrlUsingRouter,
  } = useHistory();

  const {
    auditoriumSection,
    isAuditoriumSectionLoaded,

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

  useUpdateAuditoriumRecentSeatedUsers(venueId, isUserSeated && sectionId);

  // Ensure the user leaves their seat when they leave the section
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

  const sectionsCount = venue.sectionsCount ?? 0;
  const hasOnlyOneSection = sectionsCount === 1;

  const renderReactions = () => {
    return (
      venue.showReactions && (
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

    if (hasOnlyOneSection && parentVenueId) {
      return enterVenue(parentVenueId, {
        // NOTE: Replace URL here to get rid of /section/sectionId in the URL
        customOpenExternalUrl: replaceUrlUsingRouter,
      });
    }

    enterVenue(venueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [
    venueId,
    openUrlUsingRouter,
    replaceUrlUsingRouter,
    hasOnlyOneSection,
    parentVenueId,
  ]);

  if (!isAuditoriumSectionLoaded) {
    return <Loading label="Loading section data" />;
  }

  if (!auditoriumSection) return <p>The section id is invalid</p>;

  return (
    <VenueWithOverlay venue={venue} containerClassNames="Section">
      <BackButton
        onClick={backToMain}
        locationName={
          hasOnlyOneSection && parentVenue ? parentVenue.name : "overview"
        }
      />
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
    </VenueWithOverlay>
  );
};
