import React, { useEffect } from "react";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuditoriumSpaceWithId, UserWithId } from "types/id";

import { createErrorCapture } from "utils/error";

import { useAuditoriumGrid, useAuditoriumSection } from "hooks/auditorium";
import { useAnalytics } from "hooks/useAnalytics";

import { Loading } from "components/molecules/Loading";

import styles from "./Section.module.scss";

export interface SectionProps {
  user: UserWithId;
  venue: AuditoriumSpaceWithId;
  sectionId: string;
}

export const Section: React.FC<SectionProps> = ({ user, venue, sectionId }) => {
  const {
    auditoriumSection,
    isAuditoriumSectionLoaded,

    takenSeat,

    getUserBySeat,
    takeSeat,
    leaveSeat,
  } = useAuditoriumSection({
    user,
    venue,
    sectionId,
  });

  const isUserSeated = !!takenSeat;

  const analytics = useAnalytics({ venue });

  // Ensure the user leaves their seat when they leave the section
  useEffect(() => {
    return () => {
      leaveSeat().catch(
        createErrorCapture({
          message: "Problem leaving seat",
          where: "Section",
        })
      );
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
    <div
      data-bem="Section"
      data-block="Section"
      data-side="att"
      className={styles.section}
    >
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
