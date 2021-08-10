import React, { useMemo } from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { Loading } from "components/molecules/Loading";
import { ScheduleItemNG } from "components/molecules/ScheduleItemNG";

import "./ScheduleEventListNG.scss";

export interface ScheduleEventListNGProps {
  daysEvents: PersonalizedVenueEvent[];
  isLoading: boolean;
  showPersonalisedSchedule: boolean;
}

export const ScheduleEventListNG: React.FC<ScheduleEventListNGProps> = ({
  daysEvents,
  isLoading,
  showPersonalisedSchedule,
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
        <div className="ScheduleNG__no-events">
          {showPersonalisedSchedule ? "No saved events" : "No events scheduled"}
        </div>
      ) : (
        eventsRows
      )}
    </div>
  );
};
