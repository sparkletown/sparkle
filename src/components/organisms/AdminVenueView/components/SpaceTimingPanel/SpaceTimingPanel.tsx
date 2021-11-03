import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import {
  AdminSidebarFooter,
  AdminSidebarFooterProps,
} from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { SpaceTimingForm } from "components/organisms/SpaceTimingForm";

import { EventsView } from "../EventsView";

import "./SpaceTimingPanel.scss";

export interface SpaceTimingPanelProps extends AdminSidebarFooterProps {
  venue: WithId<AnyVenue>;
}

export const SpaceTimingPanel: React.FC<SpaceTimingPanelProps> = ({
  venue,
  ...sidebarFooterProps
}) => (
  <AdminPanel className="SpaceTimingPanel">
    <AdminSidebar>
      <AdminSidebarTitle>Plan your event</AdminSidebarTitle>
      <AdminSidebarFooter {...sidebarFooterProps} />
      <SpaceTimingForm venue={venue} />
    </AdminSidebar>
    <AdminShowcase>
      <EventsView venueId={venue.id} venue={venue} />
    </AdminShowcase>
  </AdminPanel>
);
