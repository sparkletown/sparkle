import { useCallback, useMemo, useState } from "react";

import { WorldEvent } from "types/venues";

import { useSpaceEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";

import { TimingDeleteModal } from "../TimingDeleteModal";
import { TimingEvent } from "../TimingEvent";
import { TimingSpace } from "../TimingSpace";
import { WorldScheduleEventModal } from "../WorldScheduleEventModal";

import "./WorldScheduleEvents.scss";

// @debt This is almost identical to EventsView, think of a better approach before merge.
export const WorldScheduleEvents: React.FC = () => {
  // @debt This refetchIndex is used to force a refetch of the data when events
  // have been edited. It's horrible and needs a rethink. It also doesn't
  // help the attendee side at all.
  const [refetchIndex, setRefetchIndex] = useState(0);

  const {
    findVenueInRelatedVenues,
    relatedVenueIds,
    isLoading: isVenuesLoading,
  } = useRelatedVenues();
  const { events, isLoaded: isEventsLoaded } = useSpaceEvents({
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

  const {
    isShown: showSplittedEvents,
    toggle: toggleSplittedEvents,
  } = useShowHide();

  const [editedEvent, setEditedEvent] = useState<WorldEvent>();

  const adminEventModalOnHide = useCallback(() => {
    setHideCreateEventModal();
    setEditedEvent(undefined);
    setRefetchIndex(refetchIndex + 1);
  }, [setHideCreateEventModal, refetchIndex]);

  const triggerRefetch = useCallback(() => {
    setRefetchIndex(refetchIndex + 1);
  }, [refetchIndex]);

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

  return (
    <div className="WorldScheduleEvents">
      <div className="WorldScheduleEvents__container">
        <div className="WorldScheduleEvents__header">
          <h4 className="WorldScheduleEvents__title">Experiences Schedule</h4>
          <Checkbox
            checked={showSplittedEvents}
            onChange={toggleSplittedEvents}
            label="Split by space"
            labelClassName="WorldScheduleEvents__checkbox"
          />
        </div>
        <div className="WorldScheduleEvents__content">
          {showSplittedEvents ? renderedSpaces : renderedEvents}
          {!hasVenueEvents && (
            <div className="WorldScheduleEvents__no-events">
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
        <div className="WorldScheduleEvents__create">
          <ButtonNG variant="primary" onClick={setShowCreateEventModal}>
            Create an Experience
          </ButtonNG>
        </div>
      )}

      {showCreateEventModal && (
        <WorldScheduleEventModal
          show={showCreateEventModal}
          onHide={() => {
            setHideCreateEventModal();
            adminEventModalOnHide();
          }}
          venueId={editedEvent?.spaceId}
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
            triggerRefetch();
          }}
          event={editedEvent}
        />
      )}
    </div>
  );
};
