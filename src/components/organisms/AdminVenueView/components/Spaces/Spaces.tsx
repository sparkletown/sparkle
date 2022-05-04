import React from "react";
import { ChannelConfiguration } from "components/admin/ChannelConfiguration";
import { PosterConfiguration } from "components/admin/PosterConfiguration";
import { ScreeningRoomVideosTable } from "components/admin/ScreeningRoomVideosTable";
import { SpaceEditForm } from "components/admin/SpaceEditForm";
import { ThreeColumnLayout } from "components/admin/ThreeColumnLayout";

import {
  ALWAYS_EMPTY_ARRAY,
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_SAFE_ZONE,
} from "settings";

import { World } from "api/world";

import { SpaceWithId } from "types/id";
import { VenueTemplate } from "types/VenueTemplate";

import { MapPreview } from "pages/Admin/MapPreview";
import { ScreeningRoomPreview } from "pages/Admin/ScreeningRoomPreview";

import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { PortalsTable } from "components/molecules/PortalsTable";

import { AdminShowcase } from "../AdminShowcase";

interface SpacesProps {
  space: SpaceWithId;
  world: World;
}

export const Spaces: React.FC<SpacesProps> = ({ space, world }) => (
  <ThreeColumnLayout>
    <AdminSidebar>
      <SpaceEditForm space={space} world={world} />
    </AdminSidebar>
    <AdminShowcase>
      <div className="px-12 sm:px-12">
        {
          // @debt use a single structure of type
          // Record<VenueTemplate,TemplateInfo> to compile all these .includes()
          // arrays
          BACKGROUND_IMG_TEMPLATES.includes(
            space.template as VenueTemplate
          ) && (
            <>
              <MapPreview
                isEditing
                venueId={space.id}
                venueName={space.name}
                mapBackground={space.mapBackgroundImageUrl}
                rooms={space.rooms ?? ALWAYS_EMPTY_ARRAY}
                safeZone={space.config?.safeZone || DEFAULT_SAFE_ZONE}
              />
              <PortalsTable space={space} />
            </>
          )
        }
        {space.template === VenueTemplate.screeningroom && (
          <>
            <ScreeningRoomPreview space={space} />
            <ScreeningRoomVideosTable space={space} />
          </>
        )}
        {space.template === VenueTemplate.meetingroom && (
          <ChannelConfiguration space={space} />
        )}
        {space.template === VenueTemplate.posterhall && (
          <PosterConfiguration space={space} />
        )}
      </div>
    </AdminShowcase>
  </ThreeColumnLayout>
);
