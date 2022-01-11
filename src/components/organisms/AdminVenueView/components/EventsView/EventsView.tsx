import React, { useCallback, useMemo, useState } from "react";

import { AnyVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";

import { useSpaceEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";

import { TimingDeleteModal } from "components/organisms/TimingDeleteModal";
import { TimingEvent } from "components/organisms/TimingEvent";
import { TimingEventModal } from "components/organisms/TimingEventModal";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EventsView.scss";

export type EventsViewProps = {
  venueId: string;
  venue: WithId<AnyVenue>;
};

export const EventsView: React.FC<EventsViewProps> = ({ venueId, venue }) => {
  const { relatedVenueIds, isLoading: isVenuesLoading } = useRelatedVenues({
    currentVenueId: venueId,
  });
  const { events, isLoaded: isEventsLoaded } = useSpaceEvents({
    worldId: venue.worldId,
    spaceIds: relatedVenueIds,
  });

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

  const [editedEvent, setEditedEvent] = useState<WorldEvent>();

  const adminEventModalOnHide = useCallback(() => {
    setHideCreateEventModal();
    setEditedEvent(undefined);
  }, [setHideCreateEventModal]);

  const hasVenueEvents = events?.length !== 0;

  const renderedEvents = useMemo(
    () =>
      events?.map((event) => (
        <TimingEvent
          event={event}
          setShowCreateEventModal={setShowCreateEventModal}
          // @debt these need to be renamed as a proper callback props onSomething
          setEditedEvent={setEditedEvent}
          key={event.id}
        />
      )),
    [events, setShowCreateEventModal, setEditedEvent]
  );

  if (isVenuesLoading || !isEventsLoaded) {
    return <Loading />;
  }

  return (
    <div className="EventsView">
      <div className="EventsView__container">
        <div className="EventsView__header">
          <h4 className="EventsView__title">Experiences Schedule</h4>
        </div>
        <div className="EventsView__content">
          {renderedEvents}
          {!hasVenueEvents && (
            <div className="EventsView__no-events">
              <p>No events yet, lets start planning!</p>
              <button
                className="btn btn-primary"
                onClick={setShowCreateEventModal}
              >
                Add experience
              </button>
            </div>
          )}
        </div>
      </div>

      {hasVenueEvents && (
        <div className="EventsView__create">
          <ButtonNG variant="primary" onClick={setShowCreateEventModal}>
            Create an Experience
          </ButtonNG>
        </div>
      )}

      {showCreateEventModal && (
        <TimingEventModal
          show={showCreateEventModal}
          onHide={() => {
            setHideCreateEventModal();
            adminEventModalOnHide();
          }}
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
          event={editedEvent}
        />
      )}
    </div>
  );
};
