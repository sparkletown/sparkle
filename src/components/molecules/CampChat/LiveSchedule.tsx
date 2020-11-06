import { useSelector } from "hooks/useSelector";
import React, { FC } from "react";
import { isEventLive } from "utils/event";
import { formatHourAndMinute } from "utils/time";
import "./LiveSchedule.scss";

interface LiveScheduleProps {}

const LiveSchedule: FC<LiveScheduleProps> = () => {
  const { venueEvents } = useSelector((state) => ({
    venueEvents: state.firestore.ordered.venueEvents,
  }));

  const liveEvents =
    venueEvents && venueEvents.length
      ? venueEvents.filter((event) => isEventLive(event))
      : [];

  return (
    <div>
      {liveEvents.map((liveEvent, index) => {
        return (
          <div key={`live-event-${index}`} className="live-event-container">
            <div className="live-schedule-date">
              <div className="live-schedule-start-date">
                {formatHourAndMinute(liveEvent.start_utc_seconds)}
              </div>
              <div className="live-schedule-end-data">
                {formatHourAndMinute(
                  liveEvent.start_utc_seconds + 60 * liveEvent.duration_minutes
                )}
              </div>
              <div className="live-schedule-indicator">Live</div>
            </div>
            <div className="live-schedule-info">
              <div className="live-schedule-title">{liveEvent.name}</div>
              <div className="live-schedule-description">
                {liveEvent.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveSchedule;
