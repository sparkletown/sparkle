import React from "react";

import { ScheduledExperience } from "types/venues";

import { Loading } from "components/molecules/Loading";
import { ScheduleEventList } from "components/molecules/ScheduleEventList";

import "./Schedule.scss";

interface ScheduleProps {
  daysEvents: ScheduledExperience[];
  scheduleDate: Date;
  isLoading: boolean;
  showPersonalisedSchedule: boolean;
}

export const Schedule: React.FC<ScheduleProps> = ({
  daysEvents,
  isLoading,
  showPersonalisedSchedule,
  scheduleDate,
}) => {
  const hasEvents = daysEvents.length > 0;

  if (isLoading) {
    return (
      <Loading
        containerClassName="Schedule__loading"
        label="Events are loading"
      />
    );
  }

  return (
    <div className="Schedule">
      {hasEvents ? (
        <ScheduleEventList
          daysEvents={daysEvents}
          scheduleDate={scheduleDate}
        />
      ) : (
        <div className="Schedule__no-events">
          {showPersonalisedSchedule ? "No saved events" : "No events scheduled"}
        </div>
      )}
    </div>
  );
};
