import React, { useMemo } from "react";
import classNames from "classnames";

import { PersonalizedVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import { Loading } from "components/molecules/Loading";

import "./ScheduleNG.scss";

export interface ScheduleNGProps {
  daysEvents: PersonalizedVenueEvent[];
  scheduleDate: Date;
  isLoading: boolean;
}

export const ScheduleNG: React.FC<ScheduleNGProps> = ({
  daysEvents,
  scheduleDate,
  isLoading,
}) => {
  console.log("scheduleDate", scheduleDate);
  const hasEvents = daysEvents.length > 0;

  const containerClasses = classNames("Schedule");

  const rowsWithTheEvents = useMemo(
    () =>
      daysEvents.map((event) => (
        <div key={event.id}>
          <span className="ScheduleItem__event-date">
            {formatDateRelativeToNow(eventStartTime(event), {
              formatToday: () => "",
            })}
          </span>

          <span className="ScheduleItem__event-time">
            {formatTimeLocalised(eventStartTime(event))}
          </span>

          <span className="ScheduleItem__event-date">
            {formatDateRelativeToNow(eventEndTime(event), {
              formatToday: () => "",
            })}
          </span>

          <span className="ScheduleItem__event-time">
            {formatTimeLocalised(eventEndTime(event))}
          </span>
          <div>{event.name}</div>
        </div>
      )),
    [daysEvents]
  );

  if (isLoading) {
    return (
      <Loading
        containerClassName="Schedule__loading"
        label={"Events are loading"}
      />
    );
  }

  if (!hasEvents) {
    return (
      <div className={containerClasses}>
        <div className="Schedule__no-events">No events scheduled</div>
      </div>
    );
  }
  return <div className={containerClasses}>{rowsWithTheEvents}</div>;
};
