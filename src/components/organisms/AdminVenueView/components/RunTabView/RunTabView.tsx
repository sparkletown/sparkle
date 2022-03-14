import React from "react";

import { ALWAYS_EMPTY_ARRAY, SPACE_TAXON } from "settings";

import { SpaceWithId } from "types/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { LoadingPage } from "components/molecules/LoadingPage";
import { UserList } from "components/molecules/UserList";

import { AdminSidebarSectionTitle } from "../AdminSidebarSectionTitle";
import { MapPreview } from "../MapPreview";

export interface RunTabViewProps {
  space?: SpaceWithId;
}

export const RunTabView: React.FC<RunTabViewProps> = ({ space }) => {
  if (!space) {
    return <LoadingPage />;
  }

  const mapBackground = space.mapBackgroundImageUrl;
  const usersSample = space.recentUsersSample ?? ALWAYS_EMPTY_ARRAY;
  const userCount = space.recentUserCount ?? 0;
  const rooms = space.rooms || ALWAYS_EMPTY_ARRAY;

  return (
    <AdminPanel variant="unbound" className="RunTabView">
      <AdminSidebar>
        <AdminSidebarSectionTitle>
          Run your {SPACE_TAXON.lower}
        </AdminSidebarSectionTitle>
      </AdminSidebar>
      <div className="RunTabView__body">
        <div className="RunTabView__user-list">
          <UserList
            usersSample={usersSample}
            userCount={userCount}
            showTitle={false}
            activity={`in ${SPACE_TAXON.lower}`}
          />
        </div>
        <AdminShowcase>
          <div className="RunTabView__map RunTabView--spacing">
            <MapPreview
              isEditing={false}
              mapBackground={mapBackground}
              rooms={rooms}
              setSelectedRoom={() => undefined}
            />
          </div>
        </AdminShowcase>
      </div>
    </AdminPanel>
  );
};
