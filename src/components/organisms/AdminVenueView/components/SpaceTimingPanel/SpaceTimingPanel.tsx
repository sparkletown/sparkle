import React from "react";
import { Button } from "components/admin/Button";
import { EventsPanel } from "components/admin/EventsPanel";

import { SpaceWithId, WorldId } from "types/id";

import { useShowHide } from "hooks/useShowHide";

import { TimingEventModal } from "components/organisms/TimingEventModal";

import "./SpaceTimingPanel.scss";

interface SpaceTimingPanelProps {
  space: SpaceWithId;
}

export const SpaceTimingPanel: React.FC<SpaceTimingPanelProps> = ({
  space,
}) => {
  const {
    isShown: isShownCreateEventModal,
    show: showCreateEventModal,
    hide: hideCreateEventModal,
  } = useShowHide();

  return (
    <>
      <div className="flex justify-end sm:px-6 lg:px-8">
        <Button onClick={showCreateEventModal}>Create new experience</Button>
      </div>
      <EventsPanel worldId={space.worldId as WorldId} spaces={[space]} />
      {isShownCreateEventModal && (
        <TimingEventModal
          venue={space}
          show={isShownCreateEventModal}
          onHide={hideCreateEventModal}
          worldId={space.worldId}
        />
      )}
    </>
  );
};
