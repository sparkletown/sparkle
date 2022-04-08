import React, { useCallback, useMemo } from "react";
import { Toggle } from "components/admin/Toggle";

import { SpaceWithId, WorldId } from "types/id";

import { useSpaceEvents } from "hooks/events";
import { useShowHide } from "hooks/useShowHide";

import { TimingEvent } from "components/organisms/TimingEvent";
import { TimingSpace } from "components/organisms/TimingSpace";

import { Loading } from "components/molecules/Loading";

type EventsPanelProps = {
  worldId: WorldId;
  spaces: SpaceWithId[];
};

export const EventsPanel: React.FC<EventsPanelProps> = ({
  worldId,
  spaces,
}) => {
  const spacesIds = spaces.map((space) => space.id);

  const hasMultipleSpaces = spaces.length > 1;

  const { events, isLoaded: isEventsLoaded } = useSpaceEvents({
    worldId: worldId,
    spaceIds: spacesIds,
  });

  const {
    isShown: showSplittedEvents,
    toggle: toggleSplittedEvents,
  } = useShowHide();

  const getSpaceById = useCallback(
    (spaceId: string) => {
      return spaces.find((space) => space.id === spaceId);
    },
    [spaces]
  );

  const hasSpaceEvents = !!events?.length;

  const renderedEvents = useMemo(
    () =>
      events?.map((event) => (
        <TimingEvent
          event={event}
          space={getSpaceById(event.spaceId)}
          key={event.id}
        />
      )),
    [events, getSpaceById]
  );

  const renderedSpaces = useMemo(() => {
    const spacesSet = [...new Set(events?.map((event) => event.spaceId))];
    const getSpaceEvents = (spaceId: string) =>
      events?.filter((event) => event.spaceId === spaceId) ?? [];

    return spacesSet?.map((spaceId) => {
      if (!spaceId) {
        return undefined;
      }
      const space = spaces.find((space) => space.id === spaceId);
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
  }, [events, spaces]);

  if (!isEventsLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 lg:col-start-2 lg:col-span-2">
      <div className="px-4 sm:px-0">
        {hasMultipleSpaces && (
          <div className="flex justify-end mb-4 sm:px-6 lg:px-8">
            <Toggle
              checked={showSplittedEvents}
              onChange={toggleSplittedEvents}
              label="Split by space"
            />
          </div>
        )}
        <div className="flex flex-col">
          {hasSpaceEvents && (
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <div className="min-w-full divide-y divide-gray-200">
                  <div className="bg-white divide-y divide-gray-200">
                    {showSplittedEvents ? renderedSpaces : renderedEvents}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasSpaceEvents && (
            <div className="flex justify-center p-4 text-lg">
              <p>No events yet, lets start planning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
