import React, { useCallback, useMemo, useState } from "react";

import { ROOMS_TAXON, VENUE_SPACES_LIST } from "settings";

import { Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";
import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { useFetchAssets } from "hooks/useFetchAssets";

import { BackgroundSelect } from "pages/Admin/BackgroundSelect";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import {
  AdminSidebarFooter,
  AdminSidebarFooterProps,
} from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";
import { MapPreview } from "components/organisms/AdminVenueView/components/MapPreview";

import { SpaceEditForm } from "components/molecules/SpaceEditForm";
import { SpaceEditFormNG } from "components/molecules/SpaceEditFormNG";
import { VenueRoomItem } from "components/molecules/VenueRoomItem";

import { AdminShowcase } from "../AdminShowcase";

import "./Spaces.scss";

interface SpacesProps extends AdminSidebarFooterProps {
  venue: WithId<AnyVenue>;
}

const emptyRoomsArray: Room[] = [];

export const Spaces: React.FC<SpacesProps> = ({
  venue,
  ...sidebarFooterProps
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [updatedRoom, setUpdatedRoom] = useState<Room>();

  const {
    assets: mapBackgrounds,
    isLoading: isLoadingBackgrounds,
    error: errorFetchBackgrounds,
  } = useFetchAssets("mapBackgrounds");

  const worldId = venue.worldId;
  const hasSelectedRoom = !!selectedRoom;
  const numberOfRooms = venue?.rooms?.length ?? 0;

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
      venue?.rooms?.map((room, index) => (
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
    [venue?.rooms]
  );

  const renderAddRooms = useMemo(
    () =>
      VENUE_SPACES_LIST.map((venueSpace, index) => (
        <VenueRoomItem
          key={`${venueSpace.text}-${index}`}
          text={venueSpace.text}
          template={venueSpace.template}
          icon={venueSpace.icon}
          worldId={worldId}
        />
      )),
    [worldId]
  );

  const selectedRoomIndex =
    venue?.rooms?.findIndex((room) => room === selectedRoom) ?? -1;

  // TEMP solution: provide mapping for EditForm
  const EditForm =
    selectedRoom?.template === VenueTemplate.auditorium
      ? SpaceEditFormNG
      : SpaceEditForm;

  return (
    <AdminPanel className="Spaces">
      <AdminSidebar>
        {selectedRoom ? (
          <EditForm
            venueVisibility={venue.roomVisibility}
            room={selectedRoom}
            updatedRoom={updatedRoom}
            roomIndex={selectedRoomIndex}
            onBackClick={clearSelectedRoom}
            onDelete={clearSelectedRoom}
            onEdit={clearSelectedRoom}
          />
        ) : (
          <>
            <AdminSidebarTitle>Build your spaces</AdminSidebarTitle>
            <AdminSidebarFooter {...sidebarFooterProps} />
            <AdminSpacesListItem
              className="Spaces__venue-rooms"
              title="Map background"
            >
              <>
                <BackgroundSelect
                  isLoadingBackgrounds={isLoadingBackgrounds}
                  mapBackgrounds={mapBackgrounds}
                  venueName={venue.name}
                  worldId={venue.worldId}
                />
                {errorFetchBackgrounds && (
                  <>
                    <div>
                      The preset map backgrounds could not be fetched. Please,
                      refresh the page or upload a custom map background.
                    </div>
                    <div>Error: {errorFetchBackgrounds.message}</div>
                  </>
                )}
              </>
            </AdminSpacesListItem>
            <AdminSpacesListItem
              className="Spaces__venue-rooms"
              title={`${numberOfRooms} ${ROOMS_TAXON.capital}`}
            >
              {renderVenueRooms}
            </AdminSpacesListItem>
            <AdminSpacesListItem
              className="Spaces__venue-rooms"
              title={`Add ${ROOMS_TAXON.lower}`}
            >
              {renderAddRooms}
            </AdminSpacesListItem>
          </>
        )}
      </AdminSidebar>
      <AdminShowcase className="Spaces__map">
        <MapPreview
          isEditing={hasSelectedRoom}
          mapBackground={venue?.mapBackgroundImageUrl}
          setSelectedRoom={setSelectedRoom}
          rooms={venue?.rooms ?? emptyRoomsArray}
          onMoveRoom={updateRoomPosition}
          onResizeRoom={updateRoomSize}
          selectedRoom={selectedRoom}
        />
      </AdminShowcase>
    </AdminPanel>
  );
};
