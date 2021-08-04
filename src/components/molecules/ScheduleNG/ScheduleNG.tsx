import React, { useMemo } from "react";
import classNames from "classnames";

import { PersonalizedVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import { Loading } from "components/molecules/Loading";

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

  const eventsRows = useMemo(() => {
    const formatDateOptions = { formatToday: () => "" };

    return daysEvents.map((event) => (
      <div key={event.id} className="ScheduleNG__item">
        <div className="ScheduleNG__item--info">
          <span className="ScheduleNG__item--date">
            {formatDateRelativeToNow(eventStartTime(event), formatDateOptions)}
          </span>

          <span className="ScheduleNG__item--time">
            {formatTimeLocalised(eventStartTime(event))}
          </span>

          <span className="ScheduleNG__item--date">
            {formatDateRelativeToNow(eventEndTime(event), formatDateOptions)}
          </span>

          <span className="ScheduleNG__item--time">
            {formatTimeLocalised(eventEndTime(event))}
          </span>
        </div>
        <div className="ScheduleNG__item--name">{event.name}</div>
      </div>
    ));
  }, [daysEvents]);

  if (isLoading) {
    return (
      <Loading
        containerClassName="ScheduleNG__loading"
        label={"Events are loading"}
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
