import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAsyncFn } from "react-use";
import { Button } from "components/admin/Button";
import { MapBackgroundPlaceholder } from "components/admin/MapBackgroundPlaceholder";
import { isEqual } from "lodash";

import { ROOM_TAXON, ROOMS_TAXON } from "settings";

import { updateRoom } from "api/admin";

import { PortalInput, Room } from "types/rooms";
import { SafeZone } from "types/venues";

import { useCheckImage } from "hooks/image/useCheckImage";
import { useLiveUser } from "hooks/user/useLiveUser";

import {
  Container,
  SubVenueIcon,
} from "pages/Account/Venue/VenueMapEditor/Container";

import { Legend } from "components/atoms/Legend";

import "./MapPreview.scss";

interface MapPreviewProps {
  venueName: string;
  mapBackground?: string;
  rooms: Room[];
  venueId: string;
  isEditing: boolean;
  onRoomChange?: (rooms: Room[]) => void;
  safeZone: SafeZone;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  venueName,
  mapBackground,
  rooms,
  venueId,
  isEditing,
  onRoomChange,
  safeZone,
}) => {
  const { user } = useLiveUser();
  const [mapRooms, setMapRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (
      !mapRooms.length ||
      !isEqual(rooms.length, mapRooms.length) ||
      !isEditing
    ) {
      setMapRooms(rooms);
    }
  }, [isEditing, mapRooms, rooms]);

  // Updates the map rooms state when the room has been enabled/disabled and the prop has changed
  // We can't set the whole object because it's will update with the old position
  useEffect(() => {
    const newMapRooms = mapRooms?.map((mapRoom, index) => ({
      ...rooms?.[index],
      x_percent: mapRoom.x_percent,
      y_percent: mapRoom.y_percent,
      width_percent: mapRoom.width_percent,
      height_percent: mapRoom.height_percent,
    }));

    if (
      mapRooms.length &&
      newMapRooms.length &&
      !isEqual(newMapRooms, mapRooms)
    ) {
      setMapRooms(newMapRooms);
    }
  }, [isEditing, mapRooms, rooms]);

  const roomRef = useRef<SubVenueIcon[]>([]);

  const iconsMap = useMemo(() => {
    const iconsRooms = isEditing || mapRooms.length ? mapRooms : rooms;
    return iconsRooms.map((room, index: number) => ({
      title: room.title,
      width: room.width_percent,
      height: room.height_percent,
      top: room.y_percent,
      left: room.x_percent,
      url: room.image_url,
      roomIndex: index,
      isEnabled: room.isEnabled,
    }));
  }, [isEditing, mapRooms, rooms]);

  const updateRoomsPosition = useCallback(
    (val: SubVenueIcon[]) => {
      if (isEqual(roomRef.current, val)) return;

      roomRef.current = val;
      const normalizeRooms = Object.values(val).map(
        ({ left, top, width, height }, index) => ({
          ...rooms[index],
          x_percent: left,
          y_percent: top,
          width_percent: width,
          height_percent: height,
        })
      );
      setMapRooms(normalizeRooms);
      onRoomChange?.(normalizeRooms);
    },
    [onRoomChange, rooms]
  );

  const [{ loading: isSaving }, saveRoomPositions] = useAsyncFn(async () => {
    if (isSaving || !user) return;

    // Why is this using the ref and not mapRooms state?
    const updatedRooms = Object.values(roomRef.current);

    // Remove after forEach implementation is added.
    let roomIndex = 0;

    // Ideally this should be using forEach and promise all to send all of the requests at once, instead of 1 by 1
    // Using forEach will also allow us to use the index param and get rid of roomIndex and it's incremention
    for (const { left, top, width, height } of updatedRooms) {
      const room: PortalInput = {
        ...rooms[roomIndex],
        x_percent: left,
        y_percent: top,
        width_percent: width,
        height_percent: height,
      };

      // Requests are triggered one by one instead of bulk at once.
      await updateRoom(room, venueId, user, roomIndex);

      roomIndex += 1;
    }
  }, [rooms, user, venueId]);

  const { isValid: hasMapBackground } = useCheckImage(mapBackground);

  if (!hasMapBackground) {
    return <MapBackgroundPlaceholder />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div data-bem="MapPreview">
        <Legend text={`${venueName}'s Map`} />

        {mapBackground &&
          !isEditing &&
          mapRooms.map((room) => (
            <div
              key={room.title}
              style={{
                position: "absolute",
                top: `${room.y_percent}%`,
                left: `${room.x_percent}%`,
                width: `${room.width_percent}%`,
                height: `${room.height_percent}%`,
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  filter: room.isEnabled ? "none" : "grayscale(100%)",
                  opacity: room.isEnabled ? 1 : 0.5,
                  transition: "filter .3s ease",
                }}
                src={room.image_url}
                alt={`${ROOM_TAXON.lower} banner`}
                title={room.title}
              />
            </div>
          ))}

        {mapBackground && isEditing && (
          <Container
            interactive
            onChange={updateRoomsPosition}
            backgroundImage={mapBackground}
            iconsMap={iconsMap}
            safeZone={safeZone}
            lockAspectRatio
            isSaving={isSaving}
          />
        )}

        <Button
          disabled={isSaving}
          loading={isSaving}
          onClick={saveRoomPositions}
        >
          Save {ROOMS_TAXON.lower}
        </Button>
      </div>
    </DndProvider>
  );
};
