import React, { useEffect, useState, useMemo } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import firebase from "firebase/app";
import { OnlineStatsData } from "types/OnlineStatsData";
import _ from "lodash";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import "./SchedulePage.scss";
import { Link } from "react-router-dom";

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

const DAYS_AHEAD = 100;

export const SchedulePage = () => {
  const [openVenues, setOpenVenues] = useState<OpenVenues>();
  const [, setLoaded] = useState(false);
  console.log("SchedulePage -> openVenues", openVenues);

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getOnlineStats");
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
    }, 60 * 1000);
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
            isWithinInterval(day, {
              start: startOfDay(new Date(ve.event.start_utc_seconds * 1000)),
              end: endOfDay(
                new Date(
                  (ve.event.start_utc_seconds +
                    ve.event.duration_minutes * 60) *
                    1000
                )
              ),
            })
          )
          .sort(
            (a, b) => a.event.start_utc_seconds - b.event.start_utc_seconds
          ),
      };
    });

    return dates;
  }, [openVenues]);

  console.log("SchedulePage -> orderedEvents", orderedEvents);

  return (
    <WithNavigationBar fullscreen>
      <div className="schedule-page">
        <h3>Sparkleverse Schedule</h3>
        <div className="schedule-container">
          {orderedEvents.map((event) => (
            <div key={event.dateDay.toString()}>
              <h3>{event.dateDay.toDateString()}</h3>
              <table className="scheduling-table">
                <tr>
                  <th>Starts</th>
                  <th>Ends</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Location</th>
                </tr>
                {event.events.map((dayEvent) => (
                  <tr key={dayEvent.event.start_utc_seconds}>
                    <td>
                      {new Date(
                        dayEvent.event.start_utc_seconds * 1000
                      ).toString()}
                    </td>
                    <td>
                      {new Date(
                        (dayEvent.event.start_utc_seconds +
                          dayEvent.event.duration_minutes * 60) *
                          1000
                      ).toString()}
                    </td>
                    <td>{dayEvent.event.name}</td>
                    <td>{dayEvent.event.description}</td>
                    <td>
                      <Link to={`/in/playa/${dayEvent.venue.id}`}>
                        {dayEvent.venue.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          ))}
        </div>
      </div>
    </WithNavigationBar>
  );
};
