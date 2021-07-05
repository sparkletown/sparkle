import React, { useMemo, useCallback } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { AuditoriumSize } from "types/auditorium";
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

  const { auditoriumSections } = useAuditoriumSections(venue);

  const sectionsCount = auditoriumSections.length;

  const auditoriumSize = chooseAuditoriumSize(sectionsCount);

  const sectionPreviews = useMemo(
    () =>
      auditoriumSections.map((section) => (
        <SectionPreview key={section.id} section={section} venue={venue} />
      )),
    [auditoriumSections, venue]
  );

  const emptyBlocks = useMemo(
    () =>
      Array(4)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`AllSectionPreviews__empty-block--${index + 1}`}
          />
        )),
    []
  );

  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    enterVenue(parentVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [parentVenueId, openUrlUsingRouter]);

  const containerClasses = classNames("AllSectionPreviews", {
    "AllSectionPreviews--small": auditoriumSize === AuditoriumSize.SMALL,
    "AllSectionPreviews--medium": auditoriumSize === AuditoriumSize.MEDIUM,
    "AllSectionPreviews--large": auditoriumSize === AuditoriumSize.LARGE,
  });

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
          <div className="AllSectionPreviews__welcome-text">
            Welcome to the {venue.name}
          </div>
          <div className="AllSectionPreviews__description-text">
            Please choose a section or say hi to Sabrina! What do you think of
            having this little area here a place to leave a message to people?
          </div>
          <div className="AllSectionPreviews__action-buttons">
            <Checkbox
              defaultChecked={false}
              onChange={() => {}}
              containerClassName="AllSectionPreviews__toggler"
              label="Hide full sections"
            />

            <Button>Take a random seat</Button>
          </div>
        </div>

        {sectionPreviews}
      </div>
    </>
  );
};
