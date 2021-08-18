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
import { isEqual } from "lodash";

import { RoomInput_v2, updateRoom } from "api/admin";

import { RoomData_v2 } from "types/rooms";

import { useUser } from "hooks/useUser";

import {
  Container,
  SubVenueIconMap,
} from "pages/Account/Venue/VenueMapEdition/Container";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import Legend from "components/atoms/Legend";

import { BackgroundSelect } from "../BackgroundSelect";

import "./MapPreview.scss";

export interface MapPreviewProps {
  venueName: string;
  mapBackground?: string;
  rooms: RoomData_v2[];
  venueId: string;
  isEditing: boolean;
  onRoomChange?: (rooms: RoomData_v2[]) => void;
}

const MapPreview: React.FC<MapPreviewProps> = ({
  venueName,
  mapBackground,
  rooms,
  venueId,
  isEditing,
  onRoomChange,
}) => {
  const { user } = useUser();
  const [mapRooms, setMapRooms] = useState<RoomData_v2[]>([]);

  useEffect(() => {
    if (
      !mapRooms.length ||
      !isEqual(rooms.length, mapRooms.length) ||
      !isEditing
    ) {
      setMapRooms(rooms);
    }
  }, [isEditing, mapRooms, rooms]);

  const roomRef = useRef<SubVenueIconMap>({});

  const iconsMap = useMemo(() => {
    const iconsRooms = isEditing || mapRooms.length ? mapRooms : rooms;
    return iconsRooms.map((room, index: number) => ({
      width: room.width_percent,
      height: room.height_percent,
      top: room.y_percent,
      left: room.x_percent,
      url: room.image_url,
      roomIndex: index,
    }));
  }, [isEditing, mapRooms, rooms]);

  const updateRoomPosition = useCallback(
    (val: SubVenueIconMap) => {
      if (!isEqual(roomRef.current, val)) {
        roomRef.current = val;
        const normalizeRooms = Object.values(val).map((room, index) => ({
          ...rooms[index],
          x_percent: room.left,
          y_percent: room.top,
          width_percent: room.width,
          height_percent: room.height,
        }));
        setMapRooms(normalizeRooms);
        onRoomChange && onRoomChange(normalizeRooms);
      }
    },
    [onRoomChange, rooms]
  );

  const [{ loading: isSaving }, saveRoomPositions] = useAsyncFn(async () => {
    if (isSaving || !user) return;

    const roomArr = Object.values(roomRef.current);

    let roomIndex = 0;

    for (const r of roomArr) {
      const room: RoomInput_v2 = {
        ...rooms[roomIndex],
        x_percent: r.left,
        y_percent: r.top,
        width_percent: r.width,
        height_percent: r.height,
      };

      await updateRoom(room, venueId, user, roomIndex);
      roomIndex++;
    }
  }, [rooms, user, venueId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="MapPreview">
        <Legend text={`${venueName}'s Map`} />

        {!isEditing && (
          <BackgroundSelect
            venueName={venueName}
            mapBackground={mapBackground}
          />
        )}

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
                alt="room banner"
                title={room.title}
              />
            </div>
          ))}

        {mapBackground && isEditing && (
          <Container
            interactive
            resizable
            onChange={updateRoomPosition}
            backgroundImage={mapBackground}
            otherIcons={{}}
            // @debt It probably doesn't work as iconsMap is an array and SubVenueIconMap object is expected
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            iconsMap={iconsMap}
            coordinatesBoundary={{
              width: 100,
              height: 100,
            }}
            otherIconsStyle={{ opacity: 0.4 }}
            lockAspectRatio
            isSaving={isSaving}
          />
        )}

        <ButtonNG
          className="MapPreview__save-button"
          disabled={isSaving}
          onClick={saveRoomPositions}
        >
          {isSaving ? <div>Saving...</div> : <div>Save layout</div>}
        </ButtonNG>
      </div>
    </DndProvider>
  );
};

export default MapPreview;
