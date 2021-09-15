import React, { useMemo } from "react";

import { VenueEvent } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { TimingEvent } from "components/organisms/TimingEvent";

import "./TimingSpaceEvent.scss";

export type TimingSpaceEventProps = {
  spaceName: string;
  spaceEvents: WithId<VenueEvent>[];
  setEditedEvent: React.Dispatch<
    React.SetStateAction<WithId<VenueEvent> | undefined>
  >;
  setShowCreateEventModal: () => void;
};

export const TimingSpaceEvent: React.FC<TimingSpaceEventProps> = ({
  spaceName,
  spaceEvents,
  setShowCreateEventModal,
  setEditedEvent,
}) => {
  const { isShown: selectedSpace, toggle: toggleSelectedSpace } = useShowHide();

  const renderedSpaceEvents = useMemo(
    () =>
      spaceEvents?.map((event) => (
        <TimingEvent
          event={event}
          setShowCreateEventModal={setShowCreateEventModal}
          setEditedEvent={setEditedEvent}
          key={event.id}
        />
      )),
    [spaceEvents, setShowCreateEventModal, setEditedEvent]
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
    <div className="TimingSpaceEvent" onClick={toggleSelectedSpace}>
      <div className="TimingSpaceEvent__header">
        <span className="TimingSpaceEvent__title">{spaceName}</span>{" "}
        <span className="TimingSpaceEvent__subTitle">{spaceNameTitle}</span>
      </div>
      {selectedSpace && (
        <div className="TimingSpaceEvent__content">{renderedSpaceEvents}</div>
      )}
    </div>
  );
};
