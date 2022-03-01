import React, { useCallback, useMemo, useState } from "react";

import { SpaceId, SpaceWithId } from "types/id";
import { WorldEvent } from "types/venues";

import { useSpaceEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";

import { TimingEvent } from "components/organisms/TimingEvent";
import { TimingEventModal } from "components/organisms/TimingEventModal";
import { TimingSpace } from "components/organisms/TimingSpace";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";

import "./EventsView.scss";

type EventsViewProps = {
  spaceId: SpaceId | string;
  space: SpaceWithId;
};

export const EventsView: React.FC<EventsViewProps> = ({ spaceId, space }) => {
  const {
    findVenueInRelatedVenues,
    relatedVenueIds,
    isLoading: isVenuesLoading,
  } = useRelatedVenues({
    currentVenueId: spaceId,
  });
  const { events, isLoaded: isEventsLoaded } = useSpaceEvents({
    worldId: space.worldId,
    spaceIds: relatedVenueIds,
  });

  const {
    isShown: showCreateEventModal,
    show: setShowCreateEventModal,
    hide: setHideCreateEventModal,
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
    () => events?.map((event) => <TimingEvent event={event} key={event.id} />),
    [events]
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
        />
      );
    });
  }, [events, findVenueInRelatedVenues]);

  if (isVenuesLoading || !isEventsLoaded) {
    return <Loading />;
  }

  return (
    <div className="EventsView">
      <div className="EventsView__container">
        <div className="EventsView__header">
          <h4 className="EventsView__title">Experiences Schedule</h4>
          <Checkbox
            checked={showSplittedEvents}
            onChange={toggleSplittedEvents}
            label="Split by space"
            labelClassName="EventsView__checkbox"
          />
        </div>
        <div className="EventsView__content">
          {showSplittedEvents ? renderedSpaces : renderedEvents}
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
          template={space.template}
          venueId={spaceId}
          venue={space}
          event={editedEvent}
          worldId={space.worldId}
        />
      )}
    </div>
  );
};
