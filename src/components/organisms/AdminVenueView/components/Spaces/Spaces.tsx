import React from "react";

import { BACKGROUND_IMG_TEMPLATES } from "settings";

import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { MapPreview } from "components/organisms/AdminVenueView/components/MapPreview";

import { SpaceEditForm } from "components/molecules/SpaceEditForm";

import { AdminShowcase } from "../AdminShowcase";

import "./Spaces.scss";

interface SpacesProps {
  venue: WithId<AnyVenue>;
}

export const Spaces: React.FC<SpacesProps> = ({ venue }) => {
  return (
    <AdminPanel variant="bound" className="Spaces">
      <AdminSidebar>
        <SpaceEditForm space={venue} />
      </AdminSidebar>
      <AdminShowcase className="Spaces__map">
        {BACKGROUND_IMG_TEMPLATES.includes(venue.template as VenueTemplate) && (
          <MapPreview
            isEditing={false}
            mapBackground={venue?.mapBackgroundImageUrl}
            rooms={venue.rooms || []}
            setSelectedRoom={() => undefined}
          />
        )}
      </AdminShowcase>
    </AdminPanel>
  );
};
