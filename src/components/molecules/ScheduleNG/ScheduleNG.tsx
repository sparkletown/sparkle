import React, { useMemo } from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { Loading } from "components/molecules/Loading";
import { ScheduleItemNG } from "components/molecules/ScheduleItemNG";

import "./ScheduleNG.scss";

export interface ScheduleNGProps {
  daysEvents: PersonalizedVenueEvent[];
  isLoading: boolean;
}

export const ScheduleNG: React.FC<ScheduleNGProps> = ({
  daysEvents,
  isLoading,
}) => {
  const hasEvents = daysEvents.length > 0;

  const eventsRows = useMemo(
    () =>
      daysEvents.map((event) => (
        <ScheduleItemNG key={event.id} event={event} />
      )),
    [daysEvents]
  );

  if (isLoading) {
    return (
      <Loading
        containerClassName="ScheduleNG__loading"
        label="Events are loading"
      />
    );
  }

  return (
    <div className="ScheduleNG">
      {!hasEvents ? (
        <div className="ScheduleNG__no-events">No events scheduled</div>
      ) : (
        eventsRows
      )}
    </div>
  );
};
