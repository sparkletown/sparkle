import React, { FC, useMemo } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO } from "settings";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";

import "./ScheduleVenueDescription.scss";

const DEFAULT_VENUE_NAME = "Sparkle";
export interface ScheduleVenueDescriptionProps {
  venueId: string;
}

export const ScheduleVenueDescription: FC<ScheduleVenueDescriptionProps> = ({
  venueId,
}) => {
  const { parentVenue, currentVenue } = useConnectRelatedVenues({
    venueId,
  });

  // @debt: ideally this would find the top most parent of parents and use those details
  const scheduleVenue = useMemo(
    () => (parentVenue ? parentVenue : currentVenue),
    [parentVenue, currentVenue]
  );

  const venuePictureCssVars = useCss({
    "--venue-picture--background-image": `url(${
      scheduleVenue?.host?.icon ?? DEFAULT_VENUE_LOGO
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
            {scheduleVenue?.name ?? DEFAULT_VENUE_NAME}
          </h2>
          <h3 className="ScheduleVenueDescription__subtitle">
            {scheduleVenue?.config?.landingPageConfig?.subtitle}
          </h3>
        </div>
      </div>
      <div className="ScheduleVenueDescription__desc">
        <p>{scheduleVenue?.config?.landingPageConfig?.description}</p>
      </div>
    </div>
  );
};
