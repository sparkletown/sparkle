import React from "react";

import { ScheduledVenueEvent } from "types/venues";

import { Loading } from "components/molecules/Loading";
import { ScheduleEventListNG } from "components/molecules/ScheduleEventListNG";

import "./ScheduleNG.scss";

export interface ScheduleNGProps {
  daysEvents: ScheduledVenueEvent[];
  scheduleDate: Date;
  isLoading: boolean;
  venueId: string;
  showPersonalisedSchedule: boolean;
}

export const ScheduleNG: React.FC<ScheduleNGProps> = ({
  daysEvents,
  isLoading,
  showPersonalisedSchedule,
  scheduleDate,
  venueId,
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
        <ScheduleEventListNG
          daysEvents={daysEvents}
          scheduleDate={scheduleDate}
          venueId={venueId}
        />
      )}
    </div>
  );
};
