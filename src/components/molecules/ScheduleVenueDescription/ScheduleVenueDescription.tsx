import React, { FC } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO } from "settings";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import "./ScheduleVenueDescription.scss";

export interface ScheduleVenueDescriptionProps {
  venueId: string;
}

export const ScheduleVenueDescription: FC<ScheduleVenueDescriptionProps> = ({
  venueId,
}) => {
  const { sovereignVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const venuePictureCssVars = useCss({
    "--venue-picture--background-image": `url(${
      sovereignVenue?.host?.icon ?? DEFAULT_VENUE_LOGO
    })`,
  });

  const venuePictureClasses = classNames(
    "ScheduleVenueDescription__pic",
    venuePictureCssVars
  );

  return (
    <div className="ScheduleVenueDescription">
      <div className="ScheduleVenueDescription__main">
        <div className={venuePictureClasses} />
        <div className="ScheduleVenueDescription__title">
          <h2 className="ScheduleVenueDescription__name">
            {sovereignVenue?.name ?? "Schedule"}
          </h2>
          <h3 className="ScheduleVenueDescription__subtitle">
            {sovereignVenue?.config?.landingPageConfig?.subtitle}
          </h3>
        </div>
      </div>
      <div className="ScheduleVenueDescription__desc">
        <p>{sovereignVenue?.config?.landingPageConfig?.description}</p>
      </div>
    </div>
  );
};
