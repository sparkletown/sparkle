import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useCss } from "react-use";
import classNames from "classnames";
import { sample } from "lodash";

import { DEFAULT_VENUE_BANNER } from "settings";

import { AuditoriumEmptyBlocksCount } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";

import { chooseAuditoriumSize } from "utils/auditorium";
import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useAllAuditoriumSections } from "hooks/auditorium";
import { useValidImage } from "hooks/useCheckImage";
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
    availableSections,
  } = useAllAuditoriumSections(venue);

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

  const availableSectionIds = useMemo(
    () => availableSections.map((section) => section.id),
    [availableSections]
  );

  const enterRandomSection = useCallback(() => {
    const randomSectionId = sample(availableSectionIds);
    if (!randomSectionId) return;

    enterSection(randomSectionId);
  }, [enterSection, availableSectionIds]);

  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    enterVenue(parentVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [parentVenueId, openUrlUsingRouter]);

  const [validBannerImageUrl] = useValidImage(
    venue?.config?.landingPageConfig?.bannerImageUrl ||
      venue?.config?.landingPageConfig?.coverImageUrl,
    DEFAULT_VENUE_BANNER
  );

  const containerVars = useCss({
    background: `url("${validBannerImageUrl}")`,
  });

  const containerClasses = classNames(
    "AllSectionPreviews",
    `AllSectionPreviews--${auditoriumSize}`,
    containerVars
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
        <div className="AllSectionPreviews__background" />
        {emptyBlocks}

        <div className="AllSectionPreviews__main">
          <IFrame
            src={venue.iframeUrl}
            containerClassName="AllSectionPreviews__iframe-overlay"
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
