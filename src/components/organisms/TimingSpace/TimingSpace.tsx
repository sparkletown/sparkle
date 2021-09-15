import React, { useCallback, useMemo } from "react";

import { VenueEvent } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { TimingEvent } from "components/organisms/TimingEvent";

import { ButtonNG } from "components/atoms/ButtonNG";

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

  const handleCreateButtonClick = useCallback(
    (e) => {
      e.stopPropagation();

      setShowCreateEventModal();
    },
    [setShowCreateEventModal]
  );

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
    <div className="TimingSpace">
      <div className="TimingSpace__header" onClick={toggleSelectedSpace}>
        <span>
          <span className="TimingSpace__name">{spaceName}</span>
          <span className="TimingSpace__title">{spaceNameTitle}</span>
        </span>
        <ButtonNG
          className="TimingSpace__createButton"
          onClick={handleCreateButtonClick}
        >
          Add experience
        </ButtonNG>
      </div>
      {selectedSpace && (
        <div className="TimingSpace__content">{renderedSpaceEvents}</div>
      )}
    </div>
  );
};
