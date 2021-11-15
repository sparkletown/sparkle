import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { SpaceTimingForm } from "components/organisms/SpaceTimingForm";

import { AdminPanel } from "components/molecules/AdminPanel";
import { AdminShowcase } from "components/molecules/AdminShowcase";
import { AdminSidebar } from "components/molecules/AdminSidebar";
import {
  AdminSidebarFooter,
  AdminSidebarFooterProps,
} from "components/molecules/AdminSidebarFooter/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/molecules/AdminSidebarTitle";

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
      <SpaceTimingForm venue={venue} />
      <AdminSidebarFooter {...sidebarFooterProps} />
    </AdminSidebar>
    <AdminShowcase>
      <EventsView venueId={venue.id} venue={venue} />
    </AdminShowcase>
  </AdminPanel>
);
