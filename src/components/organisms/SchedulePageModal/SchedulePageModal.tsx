import React, { useEffect, useState, useMemo } from "react";
import "./SchedulePageModal.scss";
import { VenueEvent } from "types/VenueEvent";
import firebase from "firebase/app";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import _ from "lodash";
import { formatDate } from "../../../utils/time";
import { EventDisplay } from "../../molecules/EventDisplay/EventDisplay";
import { IS_BURN } from "secrets";
import { useVenueId } from "hooks/useVenueId";
import { useSelector } from "hooks/useSelector";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { isFutureOrLiveEvent } from "utils/event";

type DatedEvents = Array<{
  dateDay: Date;
  events: Array<VenueEvent>;
}>;

const DAYS_AHEAD = 7;

export const SchedulePageModal: React.FunctionComponent = () => {
  const venueId = useVenueId();
  const venueEvents = useSelector(
    (state) => state.firestore.ordered.venueEvents
  );
  const venue = useSelector((state) => state.firestore.data.currentVenue);

  const [loaded, setLoaded] = useState(venue?.parentId ? false : true);
  const [liveAndFutureEvents, setLiveAndFutureEvents] = useState<VenueEvent[]>(
    []
  );

  const filterFutureAndLiveEvents = (events: VenueEvent[]) => {
    return events.filter((event) => isFutureOrLiveEvent(event));
  };

  useEffect(() => {
    if (venue?.parentId) {
      firebase
        .firestore()
        .collection(`venues/${venue?.parentId}/events`)
        .get()
        .then((data) => {
          const parentVenueEvents = data.docs.map((doc) => doc.data());
          const futureAndLiveEvents = filterFutureAndLiveEvents(
            parentVenueEvents as VenueEvent[]
          );
          setLiveAndFutureEvents(futureAndLiveEvents);
        })
        .finally(() => setLoaded(true));
    } else {
      const hasVenueEvents = venueEvents && venueEvents.length;
      const futureAndLiveVenueEvents = filterFutureAndLiveEvents(venueEvents);
      setLiveAndFutureEvents(hasVenueEvents ? futureAndLiveVenueEvents : []);
    }
  }, [venue, venueEvents]);

  const orderedEvents: DatedEvents = useMemo(() => {
    if (!liveAndFutureEvents) return [];

    const nowDay = startOfDay(new Date());

    const dates: DatedEvents = _.range(0, DAYS_AHEAD).map((idx) => {
      const day = addDays(nowDay, idx);

      const todaysEvents = liveAndFutureEvents
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
        events: todaysEvents,
      };
    });

    return dates;
  }, [liveAndFutureEvents]);

  const [date, setDate] = useState(0);

  const venueWithId: WithId<Venue> = {
    ...venue!,
    id: venueId!,
  };

  return (
    <div>
      <div className="/modal-content /modal-content-events">
        <div style={{ display: "flex" }}>
          <div>
            <h3 className="italic">
              {IS_BURN
                ? "SparkleVerse Schedule of One-time Events"
                : "Schedule"}
            </h3>
          </div>
          {!loaded && <div className="spinner-border" />}
        </div>
        <div className="modal-tabs">
          {orderedEvents.map((day, idx) => (
            <button
              key={formatDate(day.dateDay.getTime())}
              className={`button ${idx === date ? "selected" : ""}`}
              style={{ width: 100 }}
              onClick={() => setDate(idx)}
            >
              {formatDate(day.dateDay.getTime() / 1000)}
            </button>
          ))}
        </div>
        <div className="events-list events-list_monday" style={{ height: 480 }}>
          {orderedEvents[date] &&
            orderedEvents[date].events.map((event) => (
              <EventDisplay
                key={event.name + Math.random().toString()}
                event={event}
                venue={venueWithId}
                joinNowButton
              />
            ))}
          {orderedEvents[date] && !orderedEvents[date].events.length && (
            <div>There are no events schedule for this day.</div>
          )}
        </div>
      </div>
    </div>
    //</Modal>
  );
};
