import React, { Dispatch, SetStateAction, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { RoomData_v2 } from "types/rooms";
import { PortalEditType } from "types/settings";
import { Dimensions, Position } from "types/utility";

import { useCheckImage } from "hooks/useCheckImage";

import { VenueRoomsEditor } from "../VenueRoomsEditor";
import { RoomIcon } from "../VenueRoomsEditor/VenueRoomsEditor";

import "./MapPreview.scss";

export interface MapPreviewProps {
  mapBackground?: string;
  rooms: RoomData_v2[];
  isEditing: boolean;
  selectedRoom?: RoomData_v2;
  onSelectRoom?: Dispatch<SetStateAction<RoomData_v2 | undefined>>;
  editType?: PortalEditType;
  onResizeRoom?: (size: Dimensions) => void;
  onMoveRoom?: (position: Position) => void;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  mapBackground,
  rooms,
  editType = PortalEditType.multiple,
  onMoveRoom,
  onResizeRoom,
  selectedRoom,
  onSelectRoom,
}) => {
  const iconsMap: RoomIcon[] = useMemo(() => {
    return rooms.map((room, index: number) => ({
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
        {hasMapBackground && (
          <div className="MapPreview__header">{`Preview of your space’s map`}</div>
        )}
        <VenueRoomsEditor
          interactive
          resizable
          lockAspectRatio
          editType={editType}
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelectRoom={onSelectRoom}
          backgroundImage={hasMapBackground ? mapBackground : undefined}
          roomIcons={iconsMap}
          coordinatesBoundary={{
            width: 100,
            height: 100,
          }}
          otherIconsStyle={{ opacity: 0.4 }}
          onMove={onMoveRoom}
          onResize={onResizeRoom}
        />
      </div>
    </DndProvider>
  );
};

export default MapPreview;
