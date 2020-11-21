import React, { useState, useMemo, FC } from "react";
import { VenueEvent } from "types/VenueEvent";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import _ from "lodash";
import { formatDate, formatDateToWeekday } from "../../../utils/time";
import { EventDisplay } from "../../molecules/EventDisplay/EventDisplay";
import { useVenueId } from "hooks/useVenueId";
import { useSelector } from "hooks/useSelector";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import {
  currentVenueSelectorData,
  parentVenueEventsSelector,
  siblingVenueEventsSelector,
  subvenueEventsSelector,
  venueEventsSelector,
} from "utils/selectors";
import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";

type DatedEvents = Array<{
  dateDay: Date;
  events: Array<VenueEvent>;
}>;

const DAYS_AHEAD = 7;

interface SchedulePageModalProps {
  isVisible?: boolean;
}

export const SchedulePageModal: FC<SchedulePageModalProps> = ({
  isVisible,
}) => {
  const venueId = useVenueId();
  useConnectRelatedVenues(venueId);
  const venue = useSelector(currentVenueSelectorData);
  const venueEvents = useSelector(venueEventsSelector);
  const subvenueEvents = useSelector(subvenueEventsSelector);
  const parentVenueEvents = useSelector(parentVenueEventsSelector);
  const siblingVenueEvents = useSelector(siblingVenueEventsSelector);

  const events = useMemo(
    () =>
      [
        ...venueEvents,
        ...subvenueEvents,
        ...parentVenueEvents,
        ...siblingVenueEvents,
      ].sort((a, b) => a.start_utc_seconds - b.start_utc_seconds),
    [venueEvents, subvenueEvents, parentVenueEvents, siblingVenueEvents]
  );

  const orderedEvents: DatedEvents = useMemo(() => {
    const hasEvents = events && events.length;

    const nowDay = startOfDay(new Date());

    const dates: DatedEvents = _.range(0, DAYS_AHEAD).map((idx) => {
      const day = addDays(nowDay, idx);

      const todaysEvents = events
        ?.filter((event) => {
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
  }, [events]);

  const [date, setDate] = useState(0);

  const venueWithId: WithId<Venue> = {
    ...venue!,
    id: venueId!,
  };

  return (
    <div>
      {isVisible && (
        <div className={`schedule-dropdown-body ${isVisible ? "show" : ""}`}>
          <div className="partyinfo-container">
            <div className="partyinfo-main">
              <div
                className="partyinfo-pic"
                style={{ backgroundImage: `url(${venue?.host?.icon})` }}
              ></div>
              <div className="partyinfo-title">
                <h2>{venue?.name}</h2>
                <h3>{venue?.config?.landingPageConfig.subtitle}</h3>
              </div>
            </div>
            <div className="partyinfo-desc">
              <p>{venue?.config?.landingPageConfig.description}</p>
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
                    venue={venueWithId}
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
