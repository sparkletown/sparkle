import React, { useEffect } from "react";
import { useParams } from "react-router";
import classNames from "classnames";

import {
  DEFAULT_REACTIONS_MUTED,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_SHOUTOUTS,
} from "settings";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAuditoriumGrid, useAuditoriumSection } from "hooks/auditorium";
import { useAnalytics } from "hooks/useAnalytics";
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
  const isReactionsMuted = venue.isReactionsMuted ?? DEFAULT_REACTIONS_MUTED;
  const isShoutoutsEnabled = venue.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS;

  const {
    isShown: isUserAudioMuted,
    toggle: toggleUserAudio,
    hide: disableUserAudio,
    show: enableUserAudio,
  } = useShowHide(isReactionsMuted);

  useEffect(() => {
    if (venue.isReactionsMuted) {
      enableUserAudio();
    } else {
      disableUserAudio();
    }
  }, [venue.isReactionsMuted, disableUserAudio, enableUserAudio]);

  const { parentVenue } = useRelatedVenues({
    currentVenueId: venue.id,
  });

  const { iframeUrl, id: venueId } = venue;
  const { sectionId } = useParams<{ sectionId: string }>();

  const {
    auditoriumSection,
    isAuditoriumSectionLoaded,

    baseRowsCount,
    baseColumnsCount,

    // TODO-redesign - use these or delete them
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    screenHeightInSeats,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const analytics = useAnalytics({ venue });

  // Ensure the user leaves their seat when they leave the section
  useEffect(() => {
    return () => {
      leaveSeat();
    };
  }, [leaveSeat]);

  useEffect(() => {
    analytics.trackEnterAuditoriumSectionEvent();
  }, [analytics]);

  useEffect(() => {
    isUserSeated && analytics.trackTakeSeatEvent();
  }, [analytics, isUserSeated]);

  const centralScreenClasses = classNames("Section__central-screen");

  const seatsGrid = useAuditoriumGrid({
    isUserAudioMuted,
    rows: baseRowsCount,
    columns: baseColumnsCount,
    checkIfSeat,
    getUserBySeat,
    takeSeat,
  });

  const sectionsCount = venue.sectionsCount ?? DEFAULT_SECTIONS_AMOUNT;
  const hasOnlyOneSection = sectionsCount === 1;

  const renderReactions = () => {
    return (
      venue.showReactions && (
        <div className="Section__reactions">
          <ReactionsBar
            venueId={venueId}
            leaveSeat={leaveSeat}
            isReactionsMuted={isUserAudioMuted}
            isAudioDisabled={isReactionsMuted}
            toggleMute={toggleUserAudio}
            isShoutoutsEnabled={isShoutoutsEnabled}
          />
        </div>
      )
    );
  };

  const isSimpleBackButton = hasOnlyOneSection && parentVenue;

  if (!isAuditoriumSectionLoaded) {
    return <Loading label="Loading section data" />;
  }

  if (!auditoriumSection) return <p>The section id is invalid</p>;

  return (
    <VenueWithOverlay venue={venue} containerClassNames="Section">
      {isSimpleBackButton ? (
        <BackButton
          variant="external"
          space={parentVenue}
          locationName={parentVenue?.name}
        />
      ) : (
        <BackButton variant="relative" space={venue} locationName="overview" />
      )}

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
