import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import { sample } from "lodash";

import { DEFAULT_SECTIONS_AMOUNT } from "settings";

import { AuditoriumEmptyBlocksCount } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";

import { chooseAuditoriumSize } from "utils/auditorium";
import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { useAllAuditoriumSections } from "hooks/auditorium";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { BackButton } from "components/atoms/BackButton";
import { ButtonOG } from "components/atoms/ButtonOG";
import { Checkbox } from "components/atoms/Checkbox";
import { IFrame } from "components/atoms/IFrame";
import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";
import { Loading } from "components/molecules/Loading";

import { SectionPreview } from "../SectionPreview";

import "./AllSectionPreviews.scss";

export interface SectionPreviewsProps {
  venue: WithId<AuditoriumVenue>;
}

export const AllSectionPreviews: React.FC<SectionPreviewsProps> = ({
  venue,
}) => {
  const match = useRouteMatch();

  const { parentVenue } = useRelatedVenues({
    currentVenueId: venue.id,
  });

  const {
    auditoriumSections,
    loadMore,
    toggleFullAuditoriums,
    isFullAuditoriumsHidden,
    enterSection,
    availableSections,
  } = useAllAuditoriumSections(venue);

  const sectionsCount = venue.sectionsCount ?? DEFAULT_SECTIONS_AMOUNT;
  const hasOnlyOneSection = sectionsCount === 1;
  const [firstSection] = auditoriumSections;

  const auditoriumSize = chooseAuditoriumSize(sectionsCount);

  const [iframeUrl, setIframeUrl] = useState("");
  useLayoutEffect(() => {
    if (!venue) return;

    setIframeUrl(
      convertToEmbeddableUrl({
        url: venue.iframeUrl,
        autoPlay: venue.autoPlay,
      })
    );
  }, [venue]);

  const availableSectionIds = useMemo(
    () => availableSections.map((section) => section.id),
    [availableSections]
  );

  const enterRandomSection = useCallback(() => {
    const randomSectionId = sample(availableSectionIds);
    if (!randomSectionId) return;

    enterSection(randomSectionId);
  }, [enterSection, availableSectionIds]);

  const containerClasses = classNames(
    "AllSectionPreviews",
    `AllSectionPreviews--${auditoriumSize}`
  );

  if (hasOnlyOneSection && firstSection) {
    return <Redirect to={`${match.url}/section/${firstSection.id}`} />;
  }

  return (
    <>
      {parentVenue && <BackButton variant="relative" space={parentVenue} />}
      <VenueWithOverlay venue={venue} containerClassNames="">
        <InfiniteScroll
          dataLength={auditoriumSections.length}
          className={`AllSectionPreviews ${containerClasses}`}
          next={loadMore}
          hasMore={
            venue.sectionsCount
              ? auditoriumSections.length < venue.sectionsCount
              : true
          }
          loader={<Loading containerClassName="AllSectionPreviews__loader" />}
        >
          {Array(AuditoriumEmptyBlocksCount[auditoriumSize])
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`AllSectionPreviews__empty-block--${index + 1}`}
              />
            ))}

          <div className="AllSectionPreviews__main">
            <IFrame
              src={iframeUrl}
              containerClassName="AllSectionPreviews__iframe-overlay"
              iframeClassname="AllSectionPreviews__iframe"
            />
            <div className="AllSectionPreviews__welcome-text">
              {venue.title}
            </div>
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

              <ButtonOG onClick={enterRandomSection}>
                Enter random section
              </ButtonOG>
            </div>
          </div>

          {auditoriumSections.map((section) => (
            <SectionPreview
              key={section.id}
              section={section}
              venue={venue}
              enterSection={enterSection}
            />
          ))}
        </InfiniteScroll>
      </VenueWithOverlay>
    </>
  );
};
