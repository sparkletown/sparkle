import React from "react";
import { useParams } from "react-router";

import { AuditoriumVenue } from "types/venues";

import { useAuditoriumSection } from "hooks/auditoriumSections";

import { Video } from "../Video";

import "./Section.scss";
import { useVenueId } from "hooks/useVenueId";

export interface SectionProps {
  venue: AuditoriumVenue;
}

export const Section: React.FC<SectionProps> = () => {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const venueId = useVenueId();

  const section = useAuditoriumSection({ venueId, sectionId });

  if (!section) return <p>No such section was found</p>;

  return (
    <div className="section">
      Imagine a lot of seats here
      <Video
        overlayClassname="section__video-overlay"
        iframeClassname="section__video-iframe"
      />
    </div>
  );
};
