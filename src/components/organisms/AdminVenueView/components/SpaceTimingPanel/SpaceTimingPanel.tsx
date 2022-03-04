import React from "react";

import { SpaceWithId } from "types/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { SpaceTimingForm } from "components/organisms/SpaceTimingForm";

import { AdminSidebarSectionTitle } from "../AdminSidebarSectionTitle";

import "./SpaceTimingPanel.scss";

interface SpaceTimingPanelProps {
  space: SpaceWithId;
}

export const SpaceTimingPanel: React.FC<SpaceTimingPanelProps> = ({
  space,
}) => (
  <AdminPanel variant="bound" className="SpaceTimingPanel">
    <AdminSidebar>
      <AdminSidebarSectionTitle>Plan your event</AdminSidebarSectionTitle>
      <SpaceTimingForm venue={space} />
    </AdminSidebar>
    <AdminShowcase></AdminShowcase>
  </AdminPanel>
);
