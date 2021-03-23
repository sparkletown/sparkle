import React, { useMemo } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";

import { AuditoriumSizes } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";

import { useAuditoriumSections } from "hooks/auditoriumSections";
import { useVenueId } from "hooks/useVenueId";

import { SectionPreview } from "../SectionPreview";
import { Video } from "../Video";

import "./SectionPreviews.scss";

export interface SectionPreviewsProps {
  venue: AuditoriumVenue;
}

export const SectionPreviews: React.FC<SectionPreviewsProps> = ({ venue }) => {
  const { iframeUrl } = venue;

  const venueId = useVenueId();
  const history = useHistory();
  const { auditoriumSections } = useAuditoriumSections(venueId);

  const sectionsAmount = auditoriumSections.length;

  const auditoriumSize: AuditoriumSizes = useMemo(() => {
    if (sectionsAmount <= 4) return AuditoriumSizes.SMALL;

    if (sectionsAmount > 4 && sectionsAmount <= 10) {
      return AuditoriumSizes.MEDIUM;
    }

    return AuditoriumSizes.LARGE;
  }, [sectionsAmount]);

  const sectionPreviews = auditoriumSections.map((section) => (
    <SectionPreview
      key={section.id}
      section={section}
      onClick={() =>
        history.push(`${history.location.pathname}/section/${section.id}`)
      }
    />
  ));

  const containerClasses = classNames("section-previews", {
    "section-previews--small": auditoriumSize === AuditoriumSizes.SMALL,
    "section-previews--medium": auditoriumSize === AuditoriumSizes.MEDIUM,
    "section-previews--large": auditoriumSize === AuditoriumSizes.LARGE,
  });

  return (
    <div className={containerClasses}>
      <Video
        src={iframeUrl}
        overlayClassname="section-previews__video-overlay"
        iframeClassname="section-previews__video-iframe"
      />
      {sectionPreviews}
      <div className="section-previews__left-empty-space" />
      <div className="section-previews__right-empty-space" />
    </div>
  );
};
