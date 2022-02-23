import React, { useCallback, useMemo, useState } from "react";

import { ROOM_TAXON } from "settings";

import { EventsType } from "types/events";
import { SpaceId, SpaceWithId, WorldId } from "types/id";
import { WorldEvent } from "types/venues";

import { useSpaceEvents } from "hooks/events";
import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { TimingDeleteModal } from "components/organisms/TimingDeleteModal";
import { TimingEvent } from "components/organisms/TimingEvent";
import { TimingEventModal } from "components/organisms/TimingEventModal";
import { TimingSpace } from "components/organisms/TimingSpace";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";

import "./EventsView.scss";

export type EventsViewProps = {
  spaceId?: SpaceId | string;
  space?: SpaceWithId;
  worldId?: WorldId;
  variant: EventsType;
};

export const EventsView: React.FC<EventsViewProps> = ({
  variant,
  spaceId,
  space,
  worldId,
}) => {
  const { userId } = useUser();
  const { ownedVenues, isLoading: isSpacesLoading } = useOwnedVenues({
    worldId,
    userId,
  });

  const worldSpacesIds = ownedVenues.map((space) => space.id);

  const spaceIds = spaceId ? [spaceId] : worldSpacesIds;

  const { events, isLoaded: isEventsLoaded } = useSpaceEvents({
    worldId: space?.worldId ?? worldId,
    spaceIds: spaceIds,
  });

  const isWorldEvent = variant === "world";

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

  const { isShown: showSplitEvents, toggle: toggleSplitEvents } = useShowHide();

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
          worldId={space?.worldId ?? worldId}
          event={event}
          setShowCreateEventModal={setShowCreateEventModal}
          // @debt these need to be renamed as a proper callback props onSomething
          setEditedEvent={setEditedEvent}
          key={event.id}
        />
      )),
    [events, space?.worldId, worldId, setShowCreateEventModal]
  );

  const renderedSpaces = useMemo(() => {
    const spaces = [...new Set(events?.map((event) => event.spaceId))];
    const getSpaceEvents = (spaceId: string) =>
      events?.filter((event) => event.spaceId === spaceId) ?? [];

    return spaces?.map((spaceId) => {
      if (!spaceId) {
        return undefined;
      }
      const space = ownedVenues.find(({ id }) => id === spaceId);
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
  }, [events, setShowCreateEventModal, setEditedEvent, ownedVenues]);

  if (isSpacesLoading || !isEventsLoaded) {
    return <Loading />;
  }

  const spaceEventId = space?.id ?? editedEvent?.id;

  return (
    <div className="EventsView">
      <div className="EventsView__container">
        <div className="EventsView__header">
          <h4 className="EventsView__title">Experiences Schedule</h4>
          {isWorldEvent && (
            <Checkbox
              checked={showSplitEvents}
              onChange={toggleSplitEvents}
              label={`Split by ${ROOM_TAXON.lower}`}
              labelClassName="WorldScheduleEvents__checkbox"
            />
          )}
        </div>
        <div className="EventsView__content">
          {showSplitEvents && isWorldEvent ? renderedSpaces : renderedEvents}
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
          spaceId={spaceEventId}
          event={editedEvent}
          onDelete={setEditedEvent}
          setShowDeleteEventModal={setShowDeleteEventModal}
          worldId={space?.worldId ?? worldId}
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
