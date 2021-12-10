import React from "react";

import { BACKGROUND_IMG_TEMPLATES } from "settings";

import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { MapPreview } from "pages/Admin/MapPreview";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { PortalsTable } from "components/molecules/PortalsTable";
import { SpaceEditForm } from "components/molecules/SpaceEditForm";

import { AdminShowcase } from "../AdminShowcase";

import "./Spaces.scss";

interface SpacesProps {
  venue: WithId<AnyVenue>;
}

export const Spaces: React.FC<SpacesProps> = ({ venue: space }) => (
  <AdminPanel variant="bound" className="Spaces">
    <AdminSidebar>
      <SpaceEditForm space={space} />
    </AdminSidebar>
    <AdminShowcase>
      {BACKGROUND_IMG_TEMPLATES.includes(space.template as VenueTemplate) && (
        <MapPreview
          isEditing
          worldId={space.worldId}
          venueId={space.id}
          venueName={space.name}
          mapBackground={space.mapBackgroundImageUrl}
          rooms={space.rooms ?? []}
        />
      )}
      <PortalsTable space={space} />
    </AdminShowcase>
  </AdminPanel>
);
