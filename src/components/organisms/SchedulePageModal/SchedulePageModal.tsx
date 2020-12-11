import React, { useState, useMemo, FC } from "react";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import { range } from "lodash";

import { AnyVenue } from "types/Firestore";
import { VenueEvent } from "types/VenueEvent";

import { formatDate, formatDateToWeekday } from "utils/time";
import { WithId, WithVenueId } from "utils/id";
import { itemsToObjectByIdReducer } from "utils/reducers";
import { isEventLiveOrFuture } from "utils/event";

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
    parentVenue,
    currentVenue,
    relatedVenues,
    relatedVenueEvents,
  } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

  const relatedVenuesById: Partial<Record<
    string,
    WithId<AnyVenue>
  >> = relatedVenues.reduce(itemsToObjectByIdReducer, {});

  const orderedEvents: DatedEvents = useMemo(() => {
    const liveAndFutureEvents = relatedVenueEvents.filter(isEventLiveOrFuture);
    const hasEvents = liveAndFutureEvents.length > 0;

    const nowDay = startOfDay(new Date());

    const dates: DatedEvents = range(0, DAYS_AHEAD).map((idx) => {
      const day = addDays(nowDay, idx);

      const todaysEvents = liveAndFutureEvents
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

  const scheduleTabs = useMemo(
    () =>
      orderedEvents.map((day, idx) => (
        <li
          key={formatDate(day.dateDay.getTime())}
          className={`button ${idx === date ? "active" : ""}`}
          style={{ width: 100 }}
          onClick={() => setDate(idx)}
        >
          {formatDateToWeekday(day.dateDay.getTime() / 1000)}
        </li>
      )),
    [date, orderedEvents]
  );

  const events = useMemo(
    () =>
      orderedEvents[date]?.events.map((event) => (
        <EventDisplay
          // @debt I think is probably a poor choice for a key?
          key={event.name + Math.random().toString()}
          event={event}
          venue={relatedVenuesById[event.venueId] ?? currentVenue}
        />
      )),
    [currentVenue, date, orderedEvents, relatedVenuesById]
  );

  const hasEvents = !!orderedEvents?.[date]?.events.length;

  // TODO: this was essentially used in the old logic, but the styles look
  //  as though they will hide it anyway, so I think it's better without this?
  // if (!isVisible) return <div />;

  // TODO: ideally this would find the top most parent of parents and use those details
  const hasParentVenue = !!parentVenue;

  const partyinfoImage = hasParentVenue
    ? parentVenue?.host?.icon
    : currentVenue?.host?.icon;

  const titleText = hasParentVenue ? parentVenue?.name : currentVenue?.name;

  const subtitleText = hasParentVenue
    ? parentVenue?.config?.landingPageConfig.subtitle
    : currentVenue?.config?.landingPageConfig.subtitle;

  const descriptionText = hasParentVenue
    ? parentVenue?.config?.landingPageConfig.description
    : currentVenue?.config?.landingPageConfig.description;

  return (
    <div>
      <div className={`schedule-dropdown-body ${isVisible ? "show" : ""}`}>
        <div className="partyinfo-container">
          <div className="partyinfo-main">
            <div
              className="partyinfo-pic"
              style={{ backgroundImage: `url(${partyinfoImage})` }}
            />
            <div className="partyinfo-title">
              <h2>{titleText}</h2>
              <h3>{subtitleText}</h3>
            </div>
          </div>
          <div className="partyinfo-desc">
            <p>{descriptionText}</p>
          </div>
        </div>

        <div className="schedule-container">
          <ul className="schedule-tabs">{scheduleTabs}</ul>
          <div className="schedule-day-container">
            {events}
            {!hasEvents && (
              <div>There are no events scheduled for this day.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
