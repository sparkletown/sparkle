import React, { useMemo } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";

import { WithId } from "utils/id";
import { chooseAuditoriumSize } from "utils/auditorium";

import { AuditoriumSize } from "types/auditorium";
import { AnyVenue } from "types/venues";

import { useAuditoriumSections } from "hooks/auditoriumSections";

import { SectionPreview } from "../SectionPreview";
import { IFrame } from "../IFrame";

import "./SectionPreviews.scss";

export interface SectionPreviewsProps {
  venue: WithId<AnyVenue>;
}

export const SectionPreviews: React.FC<SectionPreviewsProps> = ({ venue }) => {
  const { iframeUrl, id: venueId } = venue;

  const history = useHistory();
  const { auditoriumSections } = useAuditoriumSections(venueId);

  const sectionsCount = auditoriumSections.length;

  const auditoriumSize = chooseAuditoriumSize(sectionsCount);

  const sectionPreviews = useMemo(
    () =>
      auditoriumSections.map((section) => (
        <SectionPreview
          key={section.id}
          section={section}
          onClick={() =>
            history.push(`${history.location.pathname}/section/${section.id}`)
          }
        />
      )),
    [auditoriumSections, history]
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
