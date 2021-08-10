import React, { useState, useCallback, useMemo } from "react";

import { WithId } from "utils/id";

import { AnyVenue, VenueEvent } from "types/venues";

import { useConnectVenueEvents } from "hooks/useConnectVenueEvents";
import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { TimingEventModal } from "components/organisms/TimingEventModal";
import { TimingDeleteModal } from "components/organisms/TimingDeleteModal";
import { TimingEvent } from "components/organisms/TimingEvent";

import { venueEventsNGSelector } from "utils/selectors";

import "./EventsView.scss";

export type EventsViewProps = {
  venueId: string;
  venue: WithId<AnyVenue>;
};

export const EventsView: React.FC<EventsViewProps> = ({ venueId, venue }) => {
  useConnectVenueEvents(venueId);

  const events = useSelector(venueEventsNGSelector);

  const {
    isShown: showCreateEventModal,
    show: setShowCreateEventModal,
    hide: setHideCreateEventModal,
  } = useShowHide();

  const {
    isShown: showDeleteEventModal,
    show: setShowDeleteEventModal,
    hide: setHideDeleteEventModal,
  } = useShowHide();

  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();

  const adminEventModalOnHide = useCallback(() => {
    setHideCreateEventModal();
    setEditedEvent(undefined);
  }, [setHideCreateEventModal]);

  const hasVenueEvents = events?.length !== 0;

  const renderedEvents = useMemo(
    () =>
      events?.map((event) => {
        return (
          <TimingEvent
            event={event}
            setShowCreateEventModal={setShowCreateEventModal}
            setEditedEvent={setEditedEvent}
            key={event.id}
          />
        );
      }),
    [events, setShowCreateEventModal, setEditedEvent]
  );

  return (
    <div className="EventsView">
      <div className="EventsView__box">
        <h4 className="EventsView__title">Events Schedule</h4>
        <div className="EventsView__content">
          {renderedEvents}
          {!hasVenueEvents && (
            <div className="EventsView__no-events">
              <p>No events yet, lets start planning!</p>
            </div>
          )}
        </div>
      </div>
      <div className="EventsView__footer">
        <ButtonNG>Import from CSV</ButtonNG>
        <ButtonNG variant="primary" onClick={setShowCreateEventModal}>
          Create an Event
        </ButtonNG>
      </div>
      {showCreateEventModal && (
        <TimingEventModal
          show={showCreateEventModal}
          onHide={() => {
            setHideCreateEventModal();
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
            setHideDeleteEventModal();
            setEditedEvent && setEditedEvent(undefined);
          }}
          venueId={venue.id}
          event={editedEvent}
        />
      )}
    </div>
  );
};
