import { FC } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO } from "settings";

import { useValidImage } from "hooks/useCheckImage";
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

  const [venueIcon] = useValidImage(
    sovereignVenue?.host?.icon,
    DEFAULT_VENUE_LOGO
  );
  const containerCssVars = useCss({
    "--venue-picture--background-image": `url(${venueIcon})`,
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
          <p className="ScheduleVenueDescription__desc">{description}</p>
        </div>
      </div>
    </div>
  );
};
