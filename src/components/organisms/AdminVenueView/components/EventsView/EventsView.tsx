import React, { useCallback, useMemo, useState } from "react";

import { EventsVariant } from "types/events";
import { AnyVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";

import { useSpaceEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";

import { TimingDeleteModal } from "components/organisms/TimingDeleteModal";
import { TimingEvent } from "components/organisms/TimingEvent";
import { TimingEventModal } from "components/organisms/TimingEventModal";
import { TimingSpace } from "components/organisms/TimingSpace";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";

import "./EventsView.scss";

export type EventsViewProps = {
  venueId?: string;
  venue?: WithId<AnyVenue>;
  worldId?: string;
  variant: EventsVariant;
};

export const EventsView: React.FC<EventsViewProps> = ({
  variant,
  venueId,
  venue,
  worldId,
}) => {
  const {
    relatedVenueIds,
    isLoading: isVenuesLoading,
    findVenueInRelatedVenues,
  } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const { events, isLoaded: isEventsLoaded } = useSpaceEvents({
    worldId: venue?.worldId ?? worldId,
    spaceIds: relatedVenueIds,
  });

  const isWorldEvent = variant === EventsVariant.world;

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

  const {
    isShown: showSplittedEvents,
    toggle: toggleSplittedEvents,
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

  const renderedSpaces = useMemo(() => {
    const spaces = [...new Set(events?.map((event) => event.spaceId))];
    const getSpaceEvents = (spaceId: string) =>
      events?.filter((event) => event.spaceId === spaceId) ?? [];

    return spaces?.map((spaceId) => {
      if (!spaceId) {
        return undefined;
      }
      const space = findVenueInRelatedVenues({ spaceId });
      if (!space) {
        return undefined;
      }
      return (
        <TimingSpace
          key={spaceId}
          space={space}
          spaceEvents={getSpaceEvents(spaceId)}
          setShowCreateEventModal={setShowCreateEventModal}
          setEditedEvent={setEditedEvent}
        />
      );
    });
  }, [
    events,
    setShowCreateEventModal,
    setEditedEvent,
    findVenueInRelatedVenues,
  ]);

  if (isVenuesLoading || !isEventsLoaded) {
    return <Loading />;
  }

  const spaceId = venue?.id ?? editedEvent?.id;

  return (
    <div className="EventsView">
      <div className="EventsView__container">
        <div className="EventsView__header">
          <h4 className="EventsView__title">Experiences Schedule</h4>
          {isWorldEvent && (
            <Checkbox
              checked={showSplittedEvents}
              onChange={toggleSplittedEvents}
              label="Split by space"
              labelClassName="WorldScheduleEvents__checkbox"
            />
          )}
        </div>
        <div className="EventsView__content">
          {showSplittedEvents && isWorldEvent ? renderedSpaces : renderedEvents}
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
          venueId={spaceId}
          event={editedEvent}
          setEditedEvent={setEditedEvent}
          setShowDeleteEventModal={setShowDeleteEventModal}
          worldId={venue?.worldId ?? worldId}
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
