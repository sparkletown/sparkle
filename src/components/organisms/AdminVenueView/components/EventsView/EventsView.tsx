import React, { useState, useCallback } from "react";

import { WithId } from "utils/id";

import { AnyVenue, VenueEvent } from "types/venues";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

import { TimingEventModal } from "components/organisms/TimingEventModal";
import { TimingDeleteModal } from "components/organisms/TimingDeleteModal";
import { TimingEvent } from "components/organisms/TimingEvent";

import "./EventsView.scss";

export type EventsViewProps = {
  venueId: string;
  venue: WithId<AnyVenue>;
};

export const EventsView: React.FC<EventsViewProps> = ({ venueId, venue }) => {
  useFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "events",
    },
  ]);

  const events = useSelector((state) => state.firestore.ordered.events);

  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();

  const adminEventModalOnHide = useCallback(() => {
    setShowCreateEventModal(false);
    setEditedEvent(undefined);
  }, []);

  return (
    <>
      <div className="EventsView">
        <h4 className="EventsView__title">Events Schedule</h4>
        <div className="EventsView__content">
          {events?.map((event) => {
            return (
              <TimingEvent
                event={event}
                setShowCreateEventModal={setShowCreateEventModal}
                setEditedEvent={setEditedEvent}
                key={event.id}
              />
            );
          })}
          {events?.length === 0 && (
            <div className="EventsView__no-events">
              <p>No events yet, lets start planning!</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowCreateEventModal(true);
                }}
              >
                Create an Event
              </button>
            </div>
          )}
        </div>
      </div>

      {events?.length !== 0 && (
        <div className="create-button">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowCreateEventModal(true);
            }}
          >
            Create an Event
          </button>
        </div>
      )}

      {showCreateEventModal && (
        <TimingEventModal
          show={showCreateEventModal}
          onHide={() => {
            setShowCreateEventModal(false);
            adminEventModalOnHide();
          }}
          template={venue.template}
          venueId={venueId}
          venue={venue}
          event={editedEvent}
          setEditedEvent={setEditedEvent}
          setShowDeleteEventModal={setShowDeleteEventModal}
        />
      )}

      {showDeleteEventModal && (
        <TimingDeleteModal
          show={showDeleteEventModal}
          onHide={() => {
            setShowDeleteEventModal(false);
            setEditedEvent && setEditedEvent(undefined);
          }}
          venueId={venue.id}
          event={editedEvent}
        />
      )}
    </>
  );
};
