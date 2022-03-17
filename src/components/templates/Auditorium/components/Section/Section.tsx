import React, { useEffect } from "react";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAuditoriumGrid, useAuditoriumSection } from "hooks/auditorium";
import { useAnalytics } from "hooks/useAnalytics";
import { useUpdateAuditoriumRecentSeatedUsers } from "hooks/useUpdateRecentSeatedUsers";

import { Loading } from "components/molecules/Loading";

import styles from "./Section.module.scss";

export interface SectionProps {
  venue: WithId<AuditoriumVenue>;
  sectionId: string;
}

export const Section: React.FC<SectionProps> = ({ venue, sectionId }) => {
  const { id: venueId } = venue;

  const {
    auditoriumSection,
    isAuditoriumSectionLoaded,

    isUserSeated,

    getUserBySeat,
    takeSeat,
    leaveSeat,
  } = useAuditoriumSection({
    venue,
    sectionId,
  });

  useUpdateAuditoriumRecentSeatedUsers(
    venue.worldId,
    venueId,
    isUserSeated && sectionId
  );

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

  const seatsGrid = useAuditoriumGrid({
    isUserAudioMuted: true,
    getUserBySeat,
    takeSeat,
  });

  if (!isAuditoriumSectionLoaded) {
    return <Loading label="Loading section data" />;
  }

  if (!auditoriumSection) return <p>The section id is invalid</p>;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Auditorium</h2>
        {isUserSeated && (
          <div className={styles.leaveButton} onClick={leaveSeat}>
            Leave
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>
        )}
      </div>
      <div className={styles.gridContainer}>{seatsGrid}</div>
    </div>
  );
};
