import React, { useMemo, useCallback } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { sample } from "lodash";

import { AuditoriumEmptyBlocksCount } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";
import { chooseAuditoriumSize } from "utils/auditorium";
import { enterVenue } from "utils/url";

import { useAuditoriumSections } from "hooks/auditoriumSections";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { BackButton } from "components/atoms/BackButton";
import { Button } from "components/atoms/Button";
import { Checkbox } from "components/atoms/Checkbox";
import { IFrame } from "components/atoms/IFrame";

import { SectionPreview } from "../SectionPreview";

import "./AllSectionPreviews.scss";

export interface SectionPreviewsProps {
  venue: WithId<AuditoriumVenue>;
}

export const AllSectionPreviews: React.FC<SectionPreviewsProps> = ({
  venue,
}) => {
  const { push: openUrlUsingRouter } = useHistory();

  const { parentVenue } = useRelatedVenues({
    currentVenueId: venue.id,
  });
  const parentVenueId = parentVenue?.id;

  const {
    auditoriumSections,
    toggleFullAuditoriums,
    isFullAuditoriumsHidden,
    enterSection,
    notFullSections,
  } = useAuditoriumSections(venue);

  const sectionsCount = auditoriumSections.length;

  const auditoriumSize = chooseAuditoriumSize(sectionsCount);

  const sectionPreviews = useMemo(
    () =>
      auditoriumSections.map((section) => (
        <SectionPreview
          key={section.id}
          section={section}
          venue={venue}
          enterSection={enterSection}
        />
      )),
    [auditoriumSections, venue, enterSection]
  );

  const emptyBlocks = useMemo(
    () =>
      Array(AuditoriumEmptyBlocksCount[auditoriumSize])
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`AllSectionPreviews__empty-block--${index + 1}`}
          />
        )),
    [auditoriumSize]
  );

  const notFullSectionIds = useMemo(
    () => notFullSections.map((section) => section.id),
    [notFullSections]
  );

  const enterRandomSection = useCallback(() => {
    const randomSectionId = sample(notFullSectionIds);
    if (!randomSectionId) return;

    enterSection(randomSectionId);
  }, [enterSection, notFullSectionIds]);

  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    enterVenue(parentVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [parentVenueId, openUrlUsingRouter]);

  const containerClasses = classNames(
    "AllSectionPreviews",
    `AllSectionPreviews--${auditoriumSize}`
  );

  return (
    <>
      {parentVenue && (
        <BackButton
          onClick={backToParentVenue}
          locationName={parentVenue.name}
        />
      )}
      <div className={containerClasses}>
        {emptyBlocks}

        <div className="AllSectionPreviews__main">
          <IFrame
            src={venue.iframeUrl}
            containerClassname="AllSectionPreviews__iframe-overlay"
            iframeClassname="AllSectionPreviews__iframe"
          />
          <div className="AllSectionPreviews__welcome-text">{venue.title}</div>
          <div className="AllSectionPreviews__description-text">
            {venue.description}
          </div>
          <div className="AllSectionPreviews__action-buttons">
            <Checkbox
              defaultChecked={isFullAuditoriumsHidden}
              onChange={toggleFullAuditoriums}
              containerClassName="AllSectionPreviews__toggler"
              label="Hide full sections"
            />

            <Button onClick={enterRandomSection}>Enter random section</Button>
          </div>
        </div>

        {sectionPreviews}
      </div>
    </>
  );
};
