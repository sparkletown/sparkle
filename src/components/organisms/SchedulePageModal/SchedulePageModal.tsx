import React, { useState, useMemo, FC } from "react";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import _ from "lodash";

import { AnyVenue } from "types/Firestore";
import { VenueEvent } from "types/VenueEvent";

import { formatDate, formatDateToWeekday } from "utils/time";
import { WithId, WithVenueId } from "utils/id";
import { itemsToObjectByIdReducer } from "utils/reducers";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import { EventDisplay } from "../../molecules/EventDisplay/EventDisplay";

type DatedEvents = Array<{
  dateDay: Date;
  events: Array<WithVenueId<VenueEvent>>;
}>;

const DAYS_AHEAD = 7;

interface SchedulePageModalProps {
  isVisible?: boolean;
}

export const SchedulePageModal: FC<SchedulePageModalProps> = ({
  isVisible,
}) => {
  const venueId = useVenueId();
  const {
    currentVenue,
    relatedVenues,
    relatedVenueEvents,
  } = useConnectRelatedVenues({
    venueId,
  });

  const relatedVenuesById: Record<
    string,
    WithId<AnyVenue>
  > = relatedVenues.reduce(itemsToObjectByIdReducer, {});

  const orderedEvents: DatedEvents = useMemo(() => {
    const hasEvents = relatedVenueEvents.length > 0;

    const nowDay = startOfDay(new Date());

    const dates: DatedEvents = _.range(0, DAYS_AHEAD).map((idx) => {
      const day = addDays(nowDay, idx);

      const todaysEvents = relatedVenueEvents
        .filter((event) => {
          return isWithinInterval(day, {
            start: startOfDay(new Date(event.start_utc_seconds * 1000)),
            end: endOfDay(
              new Date(
                (event.start_utc_seconds + event.duration_minutes * 60) * 1000
              )
            ),
          });
        })
        .sort((a, b) => a.start_utc_seconds - b.start_utc_seconds);

      return {
        dateDay: day,
        events: hasEvents ? todaysEvents : [],
      };
    });

    return dates;
  }, [relatedVenueEvents]);

  const [date, setDate] = useState(0);

  return (
    <div>
      {isVisible && (
        <div className={`schedule-dropdown-body ${isVisible ? "show" : ""}`}>
          <div className="partyinfo-container">
            <div className="partyinfo-main">
              <div
                className="partyinfo-pic"
                style={{ backgroundImage: `url(${currentVenue?.host?.icon})` }}
              />
              <div className="partyinfo-title">
                <h2>{currentVenue?.name}</h2>
                <h3>{currentVenue?.config?.landingPageConfig.subtitle}</h3>
              </div>
            </div>
            <div className="partyinfo-desc">
              <p>{currentVenue?.config?.landingPageConfig.description}</p>
            </div>
          </div>

          <div className="schedule-container">
            <ul className="schedule-tabs">
              {orderedEvents.map((day, idx) => (
                <li
                  key={formatDate(day.dateDay.getTime())}
                  className={`button ${idx === date ? "active" : ""}`}
                  style={{ width: 100 }}
                  onClick={() => setDate(idx)}
                >
                  {formatDateToWeekday(day.dateDay.getTime() / 1000)}
                </li>
              ))}
            </ul>
            <div className="schedule-day-container">
              {orderedEvents[date] &&
                orderedEvents[date].events.map((event) => (
                  <EventDisplay
                    key={event.name + Math.random().toString()}
                    event={event}
                    venue={relatedVenuesById[event.venueId] ?? currentVenue}
                  />
                ))}
              {orderedEvents[date] && !orderedEvents[date].events.length && (
                <div>There are no events scheduled for this day.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
