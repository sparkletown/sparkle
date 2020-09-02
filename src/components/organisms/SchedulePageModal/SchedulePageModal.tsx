import React, { useEffect, useState, useMemo } from "react";
import "./SchedulePageModal.scss";
import { OnlineStatsData } from "types/OnlineStatsData";
import firebase from "firebase/app";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import _ from "lodash";
import { formatDate } from "../../../utils/time";
import { EventDisplay } from "../../molecules/EventDisplay/EventDisplay";
import { REFETCH_SCHEDULE_MS } from "settings";

type OpenVenues = OnlineStatsData["openVenues"];
type OpenVenue = OpenVenues[number];

type VenueEvent = {
  venue: OpenVenue["venue"];
  event: OpenVenue["currentEvents"][number];
};

type DatedEvents = Array<{
  dateDay: Date;
  events: Array<VenueEvent>;
}>;

const DAYS_AHEAD = 7;

export const SchedulePageModal: React.FunctionComponent = () => {
  const [openVenues, setOpenVenues] = useState<OpenVenues>();
  const [, setLoaded] = useState(false);

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getLiveAndFutureEvents");
    const updateStats = () => {
      getOnlineStats()
        .then((result) => {
          const { openVenues } = result.data as OnlineStatsData;
          setOpenVenues(openVenues);
          setLoaded(true);
        })
        .catch(() => {}); // REVISIT: consider a bug report tool
    };
    updateStats();
    const id = setInterval(() => {
      updateStats();
    }, REFETCH_SCHEDULE_MS);
    return () => clearInterval(id);
  }, []);

  const orderedEvents: DatedEvents = useMemo(() => {
    if (!openVenues) return [];

    const nowDay = startOfDay(new Date());

    const allEvents = openVenues.reduce<Array<VenueEvent>>(
      (acc, ov) => [
        ...acc,
        ...ov.currentEvents.map((event) => ({ venue: ov.venue, event })),
      ],
      []
    );

    const dates: DatedEvents = _.range(0, DAYS_AHEAD).map((idx) => {
      const day = addDays(nowDay, idx);

      return {
        dateDay: day,
        events: allEvents
          .filter((ve) =>
            // some events will span multiple days. Pick events for which `day` is between the event start and end
            {
              if (ve?.event?.start_utc_seconds && ve?.event?.duration_minutes) {
                return isWithinInterval(day, {
                  start: startOfDay(
                    new Date(ve.event.start_utc_seconds * 1000)
                  ),
                  end: endOfDay(
                    new Date(
                      (ve.event.start_utc_seconds +
                        ve.event.duration_minutes * 60) *
                        1000
                    )
                  ),
                });
              } else return undefined;
            }
          )
          .sort(
            (a, b) => a.event.start_utc_seconds - b.event.start_utc_seconds
          ),
      };
    });

    return dates;
  }, [openVenues]);

  const [date, setDate] = useState(0);

  return (
    <div>
      <div className="/modal-content /modal-content-events">
        <div style={{ display: "flex" }}>
          <div>
            <h3 className="italic">Sparkleverse Schedule of One-time Events</h3>
          </div>
          {typeof openVenues !== "object" && <div className="spinner-border" />}
        </div>
        <div className="modal-tabs">
          {orderedEvents.map((day, idx) => (
            <button
              key={formatDate(day?.dateDay.getTime())}
              className={`button ${idx === date ? "selected" : ""}`}
              style={{ width: 100 }}
              onClick={() => setDate(idx)}
            >
              {formatDate(day?.dateDay.getTime() / 1000)}
            </button>
          ))}
        </div>
        <div className="events-list events-list_monday" style={{ height: 480 }}>
          {orderedEvents[date] &&
            orderedEvents[date].events.map((event) => (
              <EventDisplay
                key={event.event.name + Math.random().toString()}
                event={event.event}
                venue={event.venue}
                joinNowButton
              />
            ))}
        </div>
      </div>
    </div>
    //</Modal>
  );
};
