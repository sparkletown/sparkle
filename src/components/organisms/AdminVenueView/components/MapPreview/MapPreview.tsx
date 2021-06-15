import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isEqual } from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useUser } from "hooks/useUser";

import { Container } from "../Container";
import Legend from "components/atoms/Legend";
import { RoomData_v2 } from "types/rooms";
import { SubVenueIconMap } from "pages/Account/Venue/VenueMapEdition/Container";
import "./MapPreview.scss";

export interface MapPreviewProps {
  venueName: string;
  mapBackground?: string;
  rooms: RoomData_v2[];
  venueId: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  selectedRoom: RoomData_v2 | undefined;
  onRoomChange: (rooms: RoomData_v2[]) => void;
  setSelectedRoom: Dispatch<SetStateAction<RoomData_v2 | undefined>>;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  venueName,
  mapBackground,
  rooms,
  venueId,
  isEditing,
  setIsEditing,
  onRoomChange,
  selectedRoom,
  setSelectedRoom,
}) => {
  const { user } = useUser();
  const [mapRooms, setMapRooms] = useState<RoomData_v2[]>([]);
  // Move this state up
  // const [updatedRooms, setUpdatedRooms] = useState<RoomData_v2[]>([]);
  // const [isSaving, setSaving] = useState<boolean>(false);

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

  if (!user) return <></>;

  const handleOnChange = (val: SubVenueIconMap) => {
    if (!isEqual(roomRef.current, val)) {
      roomRef.current = val;
      const normalizeRooms = Object.values(val).map((room, index) => ({
        ...rooms[index],
        x_percent: room.left,
        y_percent: room.top,
        width_percent: room.width,
        height_percent: room.height,
      }));
      onRoomChange(normalizeRooms);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="MapPreview">
        <Legend text={`Preview of your space’s map`} />
        <Container
          interactive
          resizable
          rooms={mapRooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          onChange={handleOnChange}
          backgroundImage={mapBackground ?? ""}
          otherIcons={{}}
          // @ts-ignore
          iconsMap={iconsMap}
          coordinatesBoundary={{
            width: 100,
            height: 100,
          }}
          otherIconsStyle={{ opacity: 0.4 }}
          lockAspectRatio
          isSaving={false}
        />
      </div>
    </DndProvider>
  );
};

export default MapPreview;
