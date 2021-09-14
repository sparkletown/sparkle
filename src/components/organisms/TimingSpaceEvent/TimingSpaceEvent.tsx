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

  return (
    <div className="TimingSpaceEvent" onClick={toggleSelectedSpace}>
      <div className="TimingSpaceEvent__header">
        {spaceName} - {spaceEvents.length} experience(s)
      </div>
      {selectedSpace && (
        <div className="TimingSpaceEvent__content">{renderedSpaceEvents}</div>
      )}
    </div>
  );
};
