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

  const containerCssVars = useCss({
    "--venue-picture--background-image": `url(${
      sovereignVenue?.host?.icon ?? DEFAULT_VENUE_LOGO
    })`,
  });

  const containerClasses = classNames(
    "ScheduleVenueDescription",
    containerCssVars
  );

  const { subtitle, description } =
    sovereignVenue?.config?.landingPageConfig ?? {};

  return (
    <div className={containerClasses}>
      <div className="ScheduleVenueDescription__main">
        <div className="ScheduleVenueDescription__pic" />
        <div className="ScheduleVenueDescription__title">
          <h2 className="ScheduleVenueDescription__name">
            {sovereignVenue?.name ?? "Schedule"}
          </h2>
          <h3 className="ScheduleVenueDescription__subtitle">{subtitle}</h3>
        </div>
      </div>
      <div className="ScheduleVenueDescription__desc">
        <p>{description}</p>
      </div>
    </div>
  );
};
