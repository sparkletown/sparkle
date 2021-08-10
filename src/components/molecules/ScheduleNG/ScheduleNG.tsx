import React from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { Loading } from "components/molecules/Loading";
import { ScheduleEventListNG } from "components/molecules/ScheduleEventListNG";

import "./ScheduleNG.scss";

export interface ScheduleNGProps {
  daysEvents: PersonalizedVenueEvent[];
  isLoading: boolean;
  showPersonalisedSchedule: boolean;
}

export const ScheduleNG: React.FC<ScheduleNGProps> = ({
  daysEvents,
  isLoading,
  showPersonalisedSchedule,
}) => {
  const hasEvents = daysEvents.length > 0;

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
        <ScheduleEventListNG daysEvents={daysEvents} isToday />
      )}
    </div>
  );
};
