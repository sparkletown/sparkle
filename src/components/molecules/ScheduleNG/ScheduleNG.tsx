import React, { useMemo } from "react";
import classNames from "classnames";

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

  const containerClasses = classNames("ScheduleNG");

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
    <div className={containerClasses}>
      {!hasEvents ? (
        <div className="ScheduleNG__no-events">No events scheduled</div>
      ) : (
        eventsRows
      )}
    </div>
  );
};
