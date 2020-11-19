import React, { useEffect, useState, useMemo } from "react";
import "./SchedulePageModal.scss";
import { VenueEvent } from "types/VenueEvent";
import firebase from "firebase/app";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import _ from "lodash";
import { formatDate } from "../../../utils/time";
import { EventDisplay } from "../../molecules/EventDisplay/EventDisplay";
import { REFETCH_SCHEDULE_MS } from "settings";
import { useUser } from "hooks/useUser";
import { IS_BURN } from "secrets";
import { useVenueId } from "hooks/useVenueId";
import { useSelector } from "hooks/useSelector";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { currentVenueSelectorData } from "utils/selectors";

type DatedEvents = Array<{
  dateDay: Date;
  events: Array<VenueEvent>;
}>;

const DAYS_AHEAD = 7;

export const SchedulePageModal: React.FunctionComponent = () => {
  const [venueEvents, setVenueEvents] = useState<VenueEvent[]>();
  const [loaded, setLoaded] = useState(false);
  const { profile } = useUser();
  const venueId = useVenueId();
  const venue = useSelector(currentVenueSelectorData);

  useEffect(() => {
    const updateStats = () => {
      firebase
        .functions()
        .httpsCallable("venue-getVenueEvents")({ venueId })
        .then((response) => {
          setVenueEvents(response.data as VenueEvent[]);
          setLoaded(true);
        })
        .catch(() => {}); // REVISIT: consider a bug report tool
    };
    updateStats();
    const id = setInterval(() => {
      updateStats();
    }, REFETCH_SCHEDULE_MS);
    return () => clearInterval(id);
  }, [profile, venueId, venue]);

  const orderedEvents: DatedEvents = useMemo(() => {
    if (!venueEvents) return [];

    const nowDay = startOfDay(new Date());

    const dates: DatedEvents = _.range(0, DAYS_AHEAD).map((idx) => {
      const day = addDays(nowDay, idx);

      const todaysEvents = venueEvents
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
  }, [venueEvents]);

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
