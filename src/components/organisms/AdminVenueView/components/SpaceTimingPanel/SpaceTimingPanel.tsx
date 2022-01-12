import React from "react";

import { EventsVariant } from "types/events";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { EventsView } from "../EventsView";

import "./SpaceTimingPanel.scss";

export interface SpaceTimingPanelProps {
  venue: WithId<AnyVenue>;
}

export const SpaceTimingPanel: React.FC<SpaceTimingPanelProps> = ({
  venue,
}) => (
  <AdminPanel variant="bound" className="SpaceTimingPanel">
    <AdminSidebar />
    <AdminShowcase>
      <EventsView
        variant={EventsVariant.space}
        venueId={venue.id}
        venue={venue}
      />
    </AdminShowcase>
  </AdminPanel>
);
