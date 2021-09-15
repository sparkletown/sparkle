import React, { useMemo } from "react";

import { VenueEvent } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { TimingEvent } from "components/organisms/TimingEvent";

import "./TimingSpace.scss";

export type TimingSpaceProps = {
  spaceName: string;
  spaceEvents: WithId<VenueEvent>[];
  setEditedEvent: React.Dispatch<
    React.SetStateAction<WithId<VenueEvent> | undefined>
  >;
  setShowCreateEventModal: () => void;
};

export const TimingSpace: React.FC<TimingSpaceProps> = ({
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
    <div className="TimingSpace" onClick={toggleSelectedSpace}>
      <div className="TimingSpace__header">
        <span className="TimingSpace__name">{spaceName}</span>
        <span className="TimingSpace__title">{spaceNameTitle}</span>
      </div>
      {selectedSpace && (
        <div className="TimingSpace__content">{renderedSpaceEvents}</div>
      )}
    </div>
  );
};
