import React, { useCallback, useMemo, useState } from "react";

import { ALWAYS_EMPTY_ARRAY, PORTAL_INFO_LIST, ROOMS_TAXON } from "settings";

import { Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useFetchAssets } from "hooks/useFetchAssets";

import { BackgroundSelect } from "pages/Admin/BackgroundSelect";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";
import { MapPreview } from "components/organisms/AdminVenueView/components/MapPreview";

import { PortalAddEditModal } from "components/molecules/PortalAddEditModal";
import { PortalList } from "components/molecules/PortalList";
import { PortalsTable } from "components/molecules/PortalsTable";

import { AdminShowcase } from "../AdminShowcase";

import "./Spaces.scss";

interface SpacesProps {
  venue: WithId<AnyVenue>;
}

export const Spaces: React.FC<SpacesProps> = ({ venue: space }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [updatedRoom, setUpdatedRoom] = useState<Room>();

  const {
    assets: mapBackgrounds,
    isLoading: isLoadingBackgrounds,
    error: errorFetchBackgrounds,
  } = useFetchAssets("mapBackgrounds");

  const hasSelectedRoom = !!selectedRoom;
  const numberOfRooms = space?.rooms?.length ?? 0;

  const clearSelectedRoom = useCallback(() => {
    setSelectedRoom(undefined);
    setUpdatedRoom(undefined);
  }, []);

  const updateRoomPosition = useCallback(
    async (position: Position) => {
      if (!position || !selectedRoom) return;

      setUpdatedRoom({
        ...selectedRoom,
        ...updatedRoom,
        x_percent: position.left,
        y_percent: position.top,
      });
    },
    [selectedRoom, updatedRoom]
  );

  const updateRoomSize = useCallback(
    async (size: Dimensions) => {
      if (!size || !selectedRoom) return;

      setUpdatedRoom({
        ...selectedRoom,
        ...updatedRoom,
        width_percent: size.width,
        height_percent: size.height,
      });
    },
    [selectedRoom, updatedRoom]
  );

  const renderVenueRooms = useMemo(
    () =>
      space?.rooms?.map((room, index) => (
        <div
          key={`${index}-${room.title}`}
          className="Spaces__venue-room"
          onClick={() => setSelectedRoom(room)}
        >
          <div
            className="Spaces__venue-room-logo"
            style={{ backgroundImage: `url(${room.image_url})` }}
          />
          <div className="Spaces__venue-room-title">{room.title}</div>
        </div>
      )),
    [space?.rooms]
  );

  const selectedRoomIndex =
    space?.rooms?.findIndex((room) => room === selectedRoom) ?? -1;

  return (
    <AdminPanel variant="unbound" className="Spaces">
      <AdminSidebar>
        <AdminSidebarTitle>Build your spaces</AdminSidebarTitle>
        <AdminSpacesListItem title="Map background">
          <BackgroundSelect
            venueId={space.id}
            isLoadingBackgrounds={isLoadingBackgrounds}
            mapBackgrounds={mapBackgrounds}
            venueName={space.name}
            spaceSlug={space.slug}
            worldId={space.worldId}
          />
          {errorFetchBackgrounds && (
            <>
              <div>
                The preset map backgrounds could not be fetched. Please, refresh
                the page or upload a custom map background.
              </div>
              <div>Error: {errorFetchBackgrounds.message}</div>
            </>
          )}
        </AdminSpacesListItem>
        <AdminSpacesListItem title={`${numberOfRooms} ${ROOMS_TAXON.capital}`}>
          {renderVenueRooms}
        </AdminSpacesListItem>
        <AdminSpacesListItem title={`Add ${ROOMS_TAXON.lower}`}>
          <PortalList items={PORTAL_INFO_LIST} variant="modal" />
        </AdminSpacesListItem>
      </AdminSidebar>
      <AdminShowcase variant="no-scroll">
        <MapPreview
          isEditing={hasSelectedRoom}
          mapBackground={space?.mapBackgroundImageUrl}
          setSelectedRoom={setSelectedRoom}
          rooms={space?.rooms ?? ALWAYS_EMPTY_ARRAY}
          onMoveRoom={updateRoomPosition}
          onResizeRoom={updateRoomSize}
          selectedRoom={selectedRoom}
        />
        <PortalsTable space={space} />
      </AdminShowcase>

      <PortalAddEditModal
        portal={selectedRoom}
        portalIndex={selectedRoomIndex}
        show={hasSelectedRoom}
        onHide={clearSelectedRoom}
      />
    </AdminPanel>
  );
};
