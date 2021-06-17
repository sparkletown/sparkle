import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isEqual } from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useUser } from "hooks/useUser";

import { Container } from "../Container";
import Legend from "components/atoms/Legend";
import { RoomData_v2 } from "types/rooms";
import "./MapPreview.scss";
import { Dimensions, Position } from "types/utility";

export interface MapPreviewProps {
  mapBackground?: string;
  rooms: RoomData_v2[];
  isEditing: boolean;
  selectedRoom: RoomData_v2 | undefined;
  onResizeRoom?: (size: Dimensions) => void;
  onMoveRoom?: (position: Position) => void;
  setSelectedRoom: Dispatch<SetStateAction<RoomData_v2 | undefined>>;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  mapBackground,
  rooms,
  isEditing,
  onMoveRoom,
  onResizeRoom,
  selectedRoom,
  setSelectedRoom,
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
  }, [isEditing, mapRooms.length, rooms]);

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
          onMove={onMoveRoom}
          onResize={onResizeRoom}
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
