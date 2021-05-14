import React, { FC, useMemo } from "react";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";

import "./ScheduleVenueDescription.scss";

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

  return (
    <div className="ScheduleVenueDescription">
      <div className="ScheduleVenueDescription__main">
        <div
          className="ScheduleVenueDescription__pic"
          style={{ backgroundImage: `url(${scheduleVenue?.host?.icon})` }}
        />
        <div className="ScheduleVenueDescription__title">
          <h2 className="ScheduleVenueDescription__name">
            {scheduleVenue?.name}
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
