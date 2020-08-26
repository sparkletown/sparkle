import React, { useEffect, useState, useMemo } from "react";
import "./SchedulePageModal.scss";
import { OnlineStatsData } from "types/OnlineStatsData";
import firebase from "firebase";
import { startOfDay, addDays, isWithinInterval, endOfDay } from "date-fns";
import _ from "lodash";

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

interface PropsType {
  show?: boolean;
  onHide?: () => void;
}

export const SchedulePageModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
}) => {
  const [openVenues, setOpenVenues] = useState<OpenVenues>();
  const [, setLoaded] = useState(false);

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getAllEvents");
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
            {
              if (ve.event.start_utc_seconds && ve.event.duration_minutes) {
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

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const DateToString = (Date: Date) =>
    String(Date.getDate()).padStart(2, "0") +
    " " +
    String(months[Date.getMonth()]);
  const TimeToString = (time: number) => {
    const date = new Date(time * 1000);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return hh + ":" + mm;
  };
  const daysDifferenceEnd = (time: number, duration: number) => {
    const dateNow = new Date();
    const dateOfFinish = new Date((time + duration * 60) * 1000);
    const differenceInTime = dateOfFinish.getTime() - dateNow.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.round(differenceInDays);
  };
  const daysDifferenceStart = (time: number) => {
    const dateNow = new Date();
    const dateOfStart = new Date(time * 1000);
    const differenceInTime = dateNow.getTime() - dateOfStart.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.round(differenceInDays);
  };

  const [date, setDate] = useState(0);
  console.log(orderedEvents);

  return (
    <div>
      <div className="/modal-content /modal-content-events">
        <h3 className="italic">One time events</h3>
        <div className="modal-tabs">
          {orderedEvents.map((day, idx) => (
            <button
              key={DateToString(day?.dateDay)}
              className="modal-tab selected"
              style={{ width: 100 }}
              onClick={() => setDate(idx)}
            >
              {DateToString(day?.dateDay)}
            </button>
          ))}
        </div>
        <div className="events-list events-list_monday">
          {orderedEvents[date] &&
            orderedEvents[date].events.map((event) => (
              <div
                key={event.event.name}
                className={`event ${
                  Date.now() > event.event.start_utc_seconds * 1000
                    ? "event_live"
                    : ""
                }`}
              >
                <div className="event-time">
                  <div className="event-time-start">
                    {daysDifferenceStart(event.event.start_utc_seconds) === 0
                      ? "Starts today at:"
                      : daysDifferenceStart(event.event.start_utc_seconds) > 0
                      ? `Started ${daysDifferenceStart(
                          event.event.start_utc_seconds
                        )} days ago at:`
                      : `Starts in ${-daysDifferenceStart(
                          event.event.start_utc_seconds
                        )} days at:`}
                  </div>
                  <div>{TimeToString(event.event.start_utc_seconds)}</div>
                  <div className="event-time-end">
                    {daysDifferenceEnd(
                      event.event.start_utc_seconds,
                      event.event.duration_minutes
                    ) === 0
                      ? "Ends today at:"
                      : `Ends in ${daysDifferenceEnd(
                          event.event.start_utc_seconds,
                          event.event.duration_minutes
                        )} days at:`}
                  </div>
                  <div>
                    {TimeToString(
                      event.event.start_utc_seconds +
                        event.event.duration_minutes * 60
                    )}
                  </div>
                  {Date.now() > event.event.start_utc_seconds * 1000 && (
                    <span className="event-badge-live">Live</span>
                  )}
                </div>
                <div className="event-text">
                  <h5>{event.event.name}</h5>
                  <p className="small">{event.event.description}</p>
                  <a href={`/in/playa/${event.venue.id}`} className="small">
                    {event.venue.name}
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
    //</Modal>
  );
};
