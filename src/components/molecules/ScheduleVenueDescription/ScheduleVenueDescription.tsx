import { FC } from "react";

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

  const { subtitle, description } =
    sovereignVenue?.config?.landingPageConfig ?? {};
  console.log(venueIcon);

  return (
    <div className="ScheduleVenueDescription">
      <div className="ScheduleVenueDescription__main">
        <div
          className="ScheduleVenueDescription__pic"
          style={{ backgroundImage: `url(${venueIcon})` }}
        />
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
