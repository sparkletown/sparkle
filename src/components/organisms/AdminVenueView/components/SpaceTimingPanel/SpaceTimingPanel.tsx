import React from "react";

import { EventsVariant } from "types/events";
import { SpaceWithId } from "types/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { EventsView } from "../EventsView";

import "./SpaceTimingPanel.scss";

interface SpaceTimingPanelProps {
  space: SpaceWithId;
}

export const SpaceTimingPanel: React.FC<SpaceTimingPanelProps> = ({
  space,
}) => (
  <AdminPanel variant="bound" className="SpaceTimingPanel">
    <AdminSidebar />
    <AdminShowcase>
      <EventsView
        variant={EventsVariant.space}
        spaceId={space.id}
        space={space}
      />
    </AdminShowcase>
  </AdminPanel>
);
