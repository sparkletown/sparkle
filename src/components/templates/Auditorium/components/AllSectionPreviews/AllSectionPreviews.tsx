import React, { useCallback, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import { sample } from "lodash";

import { DEFAULT_SECTIONS_AMOUNT } from "settings";

import { AuditoriumSpaceWithId } from "types/id";

import { useAllAuditoriumSections } from "hooks/auditorium";

import { Loading } from "components/molecules/Loading";

import { ButtonOG } from "components/atoms/ButtonOG";
import { Checkbox } from "components/atoms/Checkbox";
import { VenueWithOverlay } from "components/atoms/VenueWithOverlay/VenueWithOverlay";

import { SectionPreview } from "../SectionPreview";

interface SectionPreviewsProps {
  venue: AuditoriumSpaceWithId;
}

export const AllSectionPreviews: React.FC<SectionPreviewsProps> = ({
  venue,
}) => {
  const match = useRouteMatch();

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

  const availableSectionIds = useMemo(
    () => availableSections.map((section) => section.id),
    [availableSections]
  );

  const enterRandomSection = useCallback(() => {
    const randomSectionId = sample(availableSectionIds);
    if (!randomSectionId) return;

    enterSection(randomSectionId);
  }, [enterSection, availableSectionIds]);

  const containerClasses = classNames("AllSectionPreviews");

  if (hasOnlyOneSection && firstSection) {
    return <Redirect to={`${match.url}/section/${firstSection.id}`} />;
  }

  return (
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
        <div
          data-bem="AllSectionPreviews__main"
          data-block="AllSectionPreviews"
          data-side="att"
          className="AllSectionPreviews__main"
        >
          <div className="AllSectionPreviews__welcome-text">{venue.title}</div>
          <div className="AllSectionPreviews__description-text">
            {venue.config?.landingPageConfig?.description}
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
  );
};
