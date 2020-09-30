import React, { useMemo, useState } from "react";
import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "react-redux-firebase";
import { VenueDetailsPartProps, VenueEvent } from "types/VenueEvent";
import { WithId } from "utils/id";
import InformationCard from "components/molecules/InformationCard";
import { dateEventTimeFormat } from "utils/time";
import Fuse from "fuse.js";
import dayjs from "dayjs";
import AdminEventModal from "./AdminEventModal";
import AdminDeleteEvent from "./AdminDeleteEvent";

const EventsComponent: React.FC<VenueDetailsPartProps> = ({
  venue,
  showCreateEventModal,
  setShowCreateEventModal,
  editedEvent,
  setEditedEvent,
}) => {
  useFirestoreConnect([
    {
      collection: "venues",
      doc: venue.id,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "events",
    },
  ]);

  const events = useSelector((state) => state.firestore.ordered.events);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [filterPastEvents, setFilterPastEvents] = useState(false);
  const [filterText, setFilterText] = useState("");

  const upcomingEvents = useMemo(
    () =>
      filterPastEvents
        ? events?.filter(
            (ev) =>
              (ev.start_utc_seconds + ev.duration_minutes * 60) * 1000 >
              Date.now()
          )
        : events,
    [events, filterPastEvents]
  );

  const fuse = useMemo(
    () =>
      upcomingEvents
        ? new Fuse(upcomingEvents, { keys: ["name", "description", "host"] })
        : undefined,
    [upcomingEvents]
  );

  const filteredEvents = useMemo(() => {
    if (filterText === "") return upcomingEvents;
    const resultOfSearch: WithId<VenueEvent>[] | undefined = [];
    fuse && fuse.search(filterText).forEach((a) => resultOfSearch.push(a.item));
    return resultOfSearch;
  }, [fuse, filterText, upcomingEvents]);

  return (
    <>
      <div className="page-container-adminpanel-content">
        <div className="filter-event-section">
          <input
            name="Event search bar"
            className="input-block search-event-input"
            placeholder="Search for an event"
            onChange={(e) => setFilterText(e.target.value)}
            value={filterText}
          />
          <button
            className="btn btn-primary"
            onClick={() => setFilterPastEvents(!filterPastEvents)}
            style={{ marginBottom: 10 }}
          >
            {filterPastEvents
              ? "Show all the events"
              : "Only show upcoming events"}
          </button>
        </div>
        <div className="col-lg-6 col-12 oncoming-events">
          {filteredEvents && (
            <>
              {filteredEvents.map((venueEvent) => {
                const startingDate = new Date(
                  venueEvent.start_utc_seconds * 1000
                );
                const endingDate = new Date(
                  (venueEvent.start_utc_seconds +
                    60 * venueEvent.duration_minutes) *
                    1000
                );
                return (
                  <InformationCard title={venueEvent.name} key={venueEvent.id}>
                    <div className="date">
                      {`${dateEventTimeFormat(
                        startingDate
                      )}-${dateEventTimeFormat(endingDate)}
                      ${dayjs(startingDate).format("dddd MMMM Do")}`}
                    </div>
                    <div className="event-description">
                      {venueEvent.description}
                      {venueEvent.descriptions?.map((description, index) => (
                        <p key={index}>{description}</p>
                      ))}
                    </div>
                    <div className="button-container">
                      <div className="price-container">
                        {venueEvent.price > 0 && (
                          <>Individual tickets £{venueEvent.price / 100}</>
                        )}
                      </div>
                      <div className="event-payment-button-container">
                        <div>
                          <button
                            role="link"
                            className="btn btn-primary buy-tickets-button"
                            onClick={() => {
                              setEditedEvent && setEditedEvent(venueEvent);
                              setShowCreateEventModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            role="link"
                            className="btn btn-primary buy-tickets-button"
                            onClick={() => {
                              setEditedEvent && setEditedEvent(venueEvent);
                              setShowDeleteEventModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </InformationCard>
                );
              })}
            </>
          )}
        </div>
      </div>
      <div className="page-container-adminpanel-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateEventModal(true)}
        >
          Create an Event
        </button>
      </div>
      <AdminEventModal
        show={showCreateEventModal}
        onHide={() => {
          setShowCreateEventModal(false);
          setEditedEvent && setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
        template={venue.template}
      />
      <AdminDeleteEvent
        show={showDeleteEventModal}
        onHide={() => {
          setShowDeleteEventModal(false);
          setEditedEvent && setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
      />
    </>
  );
};

export default EventsComponent;
