import React, { useCallback, useMemo } from "react";

import { AnyVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG";
import { TimingEvent } from "components/organisms/TimingEvent";

import "./TimingSpace.scss";

export type TimingSpaceProps = {
  space: WithId<AnyVenue>;
  spaceEvents: WorldEvent[];
  setEditedEvent: React.Dispatch<React.SetStateAction<WorldEvent | undefined>>;
  setShowCreateEventModal: () => void;
};

export const TimingSpace: React.FC<TimingSpaceProps> = ({
  space,
  spaceEvents,
  setShowCreateEventModal,
  setEditedEvent,
}) => {
  const { isShown: selectedSpace, toggle: toggleSelectedSpace } = useShowHide();

  const onClickCreateButton = useCallback(() => {
    setShowCreateEventModal();
    setEditedEvent({ spaceId: space.id } as WorldEvent);
  }, [setShowCreateEventModal, setEditedEvent, space.id]);

  const renderedSpaceEvents = useMemo(
    () =>
      spaceEvents?.map((event) => (
        <TimingEvent
          event={event}
          setShowCreateEventModal={setShowCreateEventModal}
          // @debt these need to be renamed as a proper callback props onSomething
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
          <span className="TimingSpace__name">{space.name}</span>
          <span className="TimingSpace__title">{spaceNameTitle}</span>
        </span>
        <ButtonNG
          className="TimingSpace__createButton"
          onClick={onClickCreateButton}
        >
          Create an Experience
        </ButtonNG>
      </div>
      {selectedSpace && (
        <div className="TimingSpace__content">{renderedSpaceEvents}</div>
      )}
    </div>
  );
};
