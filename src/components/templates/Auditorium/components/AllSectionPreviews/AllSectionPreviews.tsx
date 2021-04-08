import React, { useMemo } from "react";
import classNames from "classnames";

import { WithId } from "utils/id";
import { chooseAuditoriumSize } from "utils/auditorium";

import { AuditoriumSize } from "types/auditorium";
import { AnyVenue } from "types/venues";

import { useAuditoriumSections } from "hooks/auditoriumSections";

import { IFrame } from "components/atoms/IFrame";

import { SectionPreview } from "../SectionPreview";

import "./AllSectionPreviews.scss";

export interface SectionPreviewsProps {
  venue: WithId<AnyVenue>;
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
        <SectionPreview key={section.id} section={section} />
      )),
    [auditoriumSections]
  );

  const containerClasses = classNames("section-previews", {
    "section-previews--small": auditoriumSize === AuditoriumSize.SMALL,
    "section-previews--medium": auditoriumSize === AuditoriumSize.MEDIUM,
    "section-previews--large": auditoriumSize === AuditoriumSize.LARGE,
  });

  return (
    <div className={containerClasses}>
      <div className="section-previews__empty-space--left" />
      <div className="section-previews__empty-space--right" />

      <IFrame
        src={iframeUrl}
        containerClassname="section-previews__iframe-overlay"
        iframeClassname="section-previews__iframe"
      />

      {sectionPreviews}
    </div>
  );
};
