import React, { useState, useMemo, FC } from "react";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import { range } from "lodash";

import { AnyVenue, VenueEvent } from "types/venues";

import { formatDate, formatDateToWeekday } from "utils/time";
import { WithId, WithVenueId } from "utils/id";
import { itemsToObjectByIdReducer } from "utils/reducers";
import { isEventLiveOrFuture } from "utils/event";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import { EventDisplay } from "components/molecules/EventDisplay/EventDisplay";

import { START_DATE } from "settings";

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

  const relatedVenuesById: Partial<
    Record<string, WithId<AnyVenue>>
  > = relatedVenues.reduce(itemsToObjectByIdReducer, {});

  const [startDate, setStartDate] = useState(START_DATE);

  const selectStartDate = () => (
    <>
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <label>
          Select the calendar starting date:
          <div>
            <select
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            >
              <option value="today">Today</option>
              <option value="course">Educational Course</option>
              <option value="conference">Conference</option>
            </select>
          </div>
        </label>
      </form>
    </>
  );

  const orderedEvents: DatedEvents = useMemo(() => {
    const liveAndFutureEvents = relatedVenueEvents.filter(isEventLiveOrFuture);
    const hasEvents = liveAndFutureEvents.length > 0;

    const nowDay = (startDate: string) => {
      if (startDate === "conference") {
        // 21 June 2021
        const now: number | Date = startOfDay(new Date(2021, 5, 21));
        return now;
      } else if (startDate === "course") {
        // 30 May 2021
        const now: number | Date = startOfDay(new Date(2021, 4, 30));
        return now;
      } else {
        // today:
        const now: number | Date = startOfDay(new Date());
        return now;
      }
    };

    const dates: DatedEvents = range(0, DAYS_AHEAD).map((idx) => {
      const day = addDays(nowDay(startDate), idx);

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
  }, [relatedVenueEvents, startDate]);

  const [date, setDate] = useState(0);

  const scheduleTabs = useMemo(
    () =>
      orderedEvents.map((day, idx) => (
        <li
          key={formatDate(day.dateDay.getTime())}
          className={`button ${idx === date ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setDate(idx);
          }}
        >
          {formatDateToWeekday(day.dateDay.getTime() / 1000)}
        </li>
      )),
    [date, orderedEvents]
  );

  const events = useMemo(
    () =>
      orderedEvents[date]?.events.map((event, index) => (
        <EventDisplay
          key={event.id ?? `${index}-${event.name}`}
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
          <form>{selectStartDate()}</form>
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
