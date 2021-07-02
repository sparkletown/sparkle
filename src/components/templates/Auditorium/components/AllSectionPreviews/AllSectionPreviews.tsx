import React, { useMemo } from "react";
import classNames from "classnames";

import { AuditoriumSize } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";
import { chooseAuditoriumSize } from "utils/auditorium";

import { useAuditoriumSections } from "hooks/auditoriumSections";

import { IFrame } from "components/atoms/IFrame";

import { SectionPreview } from "../SectionPreview";

import "./AllSectionPreviews.scss";

export interface SectionPreviewsProps {
  venue: WithId<AuditoriumVenue>;
}

export const AllSectionPreviews: React.FC<SectionPreviewsProps> = ({
  venue,
}) => {
  const { iframeUrl, id: venueId } = venue;

  const { auditoriumSections } = useAuditoriumSections(venueId);

  const sectionsCount = auditoriumSections.length;

  const auditoriumSize = chooseAuditoriumSize(sectionsCount);

  const sectionPreviews = useMemo(
    () =>
      auditoriumSections.map((section) => (
        <SectionPreview key={section.id} section={section} venue={venue} />
      )),
    [auditoriumSections, venue]
  );

  const containerClasses = classNames("AllSectionPreviews", {
    "AllSectionPreviews--small": auditoriumSize === AuditoriumSize.SMALL,
    "AllSectionPreviews--medium": auditoriumSize === AuditoriumSize.MEDIUM,
    "AllSectionPreviews--large": auditoriumSize === AuditoriumSize.LARGE,
  });

  return (
    <div className={containerClasses}>
      <div className="AllSectionPreviews__empty-space--left" />
      <div className="AllSectionPreviews__empty-space--right" />

      <IFrame
        src={iframeUrl}
        containerClassname="AllSectionPreviews__iframe-overlay"
        iframeClassname="AllSectionPreviews__iframe"
      />

      {sectionPreviews}
    </div>
  );
};
