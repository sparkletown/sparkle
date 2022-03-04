import React, { useMemo } from "react";

import { SpaceWithId } from "types/id";
import { WorldEvent } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { TimingEvent } from "components/organisms/TimingEvent";

import "./TimingSpace.scss";

export type TimingSpaceProps = {
  space: SpaceWithId;
  spaceEvents: WorldEvent[];
};

export const TimingSpace: React.FC<TimingSpaceProps> = ({
  space,
  spaceEvents,
}) => {
  const { isShown: selectedSpace, toggle: toggleSelectedSpace } = useShowHide();

  const renderedSpaceEvents = useMemo(
    () =>
      spaceEvents?.map((event) => (
        <TimingEvent space={space} event={event} key={event.id} />
      )),
    [space, spaceEvents]
  );

  const spaceNameTitle = useMemo(() => {
    if (!spaceEvents.length) {
      return "nothing scheduled";
    }

    if (spaceEvents.length === 1) {
      return "1 experience";
    }

    return `${spaceEvents.length} experiences`;
  }, [spaceEvents.length]);

  return (
    <>
      <div
        className="flex justify-start items-center bg-gray-50 text-gray-500 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
        onClick={toggleSelectedSpace}
      >
        <div className="px-6 py-4 whitespace-nowrap w-48"></div>
        <div className="px-6 py-4 grow w-full flex flex-col">
          <span>
            <p className="TimingSpace__name">{space.name}</p>
            <p className="TimingSpace__title">{spaceNameTitle}</p>
          </span>
        </div>
      </div>

      {selectedSpace && (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg min-w-full divide-y divide-gray-200">
          {renderedSpaceEvents}
        </div>
      )}
    </>
  );
};
