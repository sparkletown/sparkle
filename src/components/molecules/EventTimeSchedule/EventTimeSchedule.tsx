import React from "react";

import "./EventTimeSchedule.scss";

export interface EventTimeScheduleProps {
  time: string;
}

export const EventTimeSchedule: React.FC<EventTimeScheduleProps> = ({
  time,
}) => {
  return (
    <div className="event-time-container">
      <div className="event-time">{time}</div>
      <div className="event-time-line" />
    </div>
  );
};
