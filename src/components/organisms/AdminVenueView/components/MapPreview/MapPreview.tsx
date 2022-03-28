import React, { Dispatch, SetStateAction, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";

import { useCheckImage } from "hooks/useCheckImage";

import { VenueRoomsEditor } from "../VenueRoomsEditor";
import { RoomIcon } from "../VenueRoomsEditor/VenueRoomsEditor";

import "./MapPreview.scss";

export interface MapPreviewProps {
  mapBackground?: string;
  rooms: Room[];
  isEditing: boolean;
  selectedRoom?: Room;
  setSelectedRoom: Dispatch<SetStateAction<Room | undefined>>;
  onResizeRoom?: (size: Dimensions) => void;
  onMoveRoom?: (position: Position) => void;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  mapBackground,
  rooms,
  onMoveRoom,
  onResizeRoom,
  selectedRoom,
  setSelectedRoom,
}) => {
  const iconsMap: RoomIcon[] = useMemo(() => {
    return rooms.map((room, index: number) => ({
      title: room.title ?? "",
      width: room.width_percent ?? 0,
      height: room.height_percent ?? 0,
      top: room.y_percent ?? 0,
      left: room.x_percent ?? 0,
      url: room.image_url ?? "",
      roomIndex: index,
    }));
  }, [rooms]);

  const { isValid: hasMapBackground } = useCheckImage(mapBackground ?? "");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="MapPreview">
        <VenueRoomsEditor
          interactive
          resizable
          lockAspectRatio
          rooms={rooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          backgroundImage={hasMapBackground ? mapBackground : undefined}
          roomIcons={iconsMap}
          coordinatesBoundary={{
            width: 100,
            height: 100,
          }}
          onMove={onMoveRoom}
          onResize={onResizeRoom}
        />
      </div>
    </DndProvider>
  );
};
