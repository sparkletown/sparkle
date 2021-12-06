import React, { useCallback, useState } from "react";
import { useAsyncFn } from "react-use";

import { BACKGROUND_IMG_TEMPLATES } from "settings";

import { updateRoom } from "api/admin";

import { PortalInput, Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";
import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { MapPreview } from "components/organisms/AdminVenueView/components/MapPreview";

import { SpaceEditForm } from "components/molecules/SpaceEditForm";

import { ButtonNG } from "components/atoms/ButtonNG";

import { AdminShowcase } from "../AdminShowcase";
import { DimensionProps } from "../VenueRoomsEditor/VenueRoomsEditor";

import "./Spaces.scss";

interface SpacesProps {
  venue: WithId<AnyVenue>;
}

/*
const pickDimensionProps = (room) => {
  return {
    x_percent: room.x_percent,
    y_percent: room.y_percent,
    width_percent: room.width_percent,
    height_percent: room.height_percent,
  }
}*/

export const Spaces: React.FC<SpacesProps> = ({ venue }) => {
  const { user } = useUser();
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  // @debt Rooms don't have a unique index so this has to be guessed at somewhat.
  // This makes this pretty fragile for when someone is editing portal data
  // as well as moving portals
  // updated rooms are keyed off their title. If that changes, then things get
  // unpredictable.
  const [updatedRooms, setUpdatedRooms] = useState<
    Record<string, DimensionProps>
  >({});

  const updateRoomPosition = useCallback(
    async (position: Position) => {
      if (!position || !selectedRoom) return;

      setUpdatedRooms({
        ...updatedRooms,
        [selectedRoom.title]: {
          ...updatedRooms[selectedRoom.title],
          x_percent: position.left,
          y_percent: position.top,
        },
      });
    },
    [selectedRoom, updatedRooms]
  );

  const updateRoomSize = useCallback(
    async (size: Dimensions) => {
      if (!size || !selectedRoom) return;

      setUpdatedRooms({
        ...updatedRooms,
        [selectedRoom.title]: {
          ...updatedRooms[selectedRoom.title],
          width_percent: size.width,
          height_percent: size.height,
        },
      });
    },
    [selectedRoom, updatedRooms]
  );

  const [{ loading: isSaving }, saveRoomPositions] = useAsyncFn(async () => {
    if (isSaving || !user) return;

    // Ideally this should be using forEach and promise all to send all of the requests at once, instead of 1 by 1
    // Using forEach will also allow us to use the index param and get rid of roomIndex and it's incremention
    let roomIndex = 0;
    for (const room of venue.rooms || []) {
      const newDimensions = updatedRooms[room.title];
      if (!newDimensions) {
        roomIndex += 1;
        continue;
      }
      const newRoom: PortalInput = {
        ...room,
        x_percent: newDimensions.x_percent ?? room.x_percent,
        y_percent: newDimensions.y_percent ?? room.y_percent,
        width_percent: newDimensions.width_percent ?? room.width_percent,
        height_percent: newDimensions.height_percent ?? room.height_percent,
      };

      // Requests are triggered one by one instead of bulk at once.
      await updateRoom(newRoom, venue.id, user, roomIndex);

      roomIndex += 1;
    }
  }, [venue.rooms, updatedRooms, user, venue.id]);

  return (
    <AdminPanel variant="bound" className="Spaces">
      <AdminSidebar>
        <SpaceEditForm space={venue} />
      </AdminSidebar>
      <div className="Spaces__PreviewContainer">
        <AdminShowcase className="Spaces__map">
          {BACKGROUND_IMG_TEMPLATES.includes(
            venue.template as VenueTemplate
          ) && (
            <MapPreview
              isEditing={false}
              mapBackground={venue?.mapBackgroundImageUrl}
              setSelectedRoom={setSelectedRoom}
              rooms={venue.rooms || []}
              onMoveRoom={updateRoomPosition}
              onResizeRoom={updateRoomSize}
              selectedRoom={selectedRoom}
              updatedDimensions={updatedRooms}
            />
          )}
        </AdminShowcase>
        {Object.keys(updatedRooms).length && (
          <ButtonNG
            variant="primary"
            onClick={saveRoomPositions}
            loading={isSaving}
            disabled={isSaving}
          >
            Save portal positions
          </ButtonNG>
        )}
      </div>
    </AdminPanel>
  );
};
