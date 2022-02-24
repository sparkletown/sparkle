import React from "react";

import { BACKGROUND_IMG_TEMPLATES } from "settings";

import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId } from "utils/id";

import { MapPreview } from "pages/Admin/MapPreview";
import { ScreeningRoomPreview } from "pages/Admin/ScreeningRoomPreview";

import { PortalsTable } from "components/molecules/PortalsTable";
import { ScreeningRoomVideosTable } from "components/molecules/ScreeningRoomVideosTable";
import { SpaceEditForm } from "components/molecules/SpaceEditForm";
import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

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
        <>
          <MapPreview
            isEditing
            worldId={space.worldId}
            venueId={space.id}
            venueName={space.name}
            mapBackground={space.mapBackgroundImageUrl}
            rooms={space.rooms ?? []}
          />
          <PortalsTable space={space} />
        </>
      )}
      {space.template === VenueTemplate.screeningroom && (
        <>
          <ScreeningRoomPreview space={space} />
          <ScreeningRoomVideosTable space={space} />
        </>
      )}
    </AdminShowcase>
  </AdminPanel>
);
