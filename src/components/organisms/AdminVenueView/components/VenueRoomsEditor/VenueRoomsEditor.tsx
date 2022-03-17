import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDrop } from "react-dnd";
import ReactResizeDetector, { useResizeDetector } from "react-resize-detector";
import classNames from "classnames";
import { MapBackgroundPlaceholder } from "components/admin/MapBackgroundPlaceholder";
import update from "immutability-helper";

import { Room } from "types/rooms";
import { Dimensions, Position } from "types/utility";

import { CustomDragLayer } from "pages/Account/Venue/VenueMapEditor";
import { DraggableSubvenue } from "pages/Account/Venue/VenueMapEditor/DraggableSubvenue";
import { DragItem } from "pages/Account/Venue/VenueMapEditor/interfaces";
import { ItemTypes } from "pages/Account/Venue/VenueMapEditor/ItemTypes";
import { snapToGrid as doSnapToGrid } from "pages/Account/Venue/VenueMapEditor/snapToGrid";

export interface RoomIcon {
  title: string;
  top: number;
  left: number;
  url: string;
  width: number;
  height: number;
  roomIndex?: number;
}

export interface RoomIconsMap {
  [key: string]: RoomIcon;
}

interface PortalSize {
  width: number;
  height: number;
}

export interface VenueRoomsEditorProps {
  snapToGrid?: boolean;
  roomIcons?: RoomIcon[];
  backgroundImage?: string;
  roomIconsMap?: RoomIconsMap;
  onOtherIconClick?: (key: string) => void;
  coordinatesBoundary: PortalSize;
  interactive: boolean;
  resizable: boolean;
  onResize?: (size: Dimensions) => void;
  onMove?: (position: Position) => void;
  backgroundImageClassName?: string;
  lockAspectRatio?: boolean;
  rooms: Room[];
  selectedRoom?: Room;
  setSelectedRoom: Dispatch<SetStateAction<Room | undefined>>;
}

export const VenueRoomsEditor: React.FC<VenueRoomsEditorProps> = ({
  snapToGrid,
  roomIcons,
  backgroundImage,
  coordinatesBoundary,
  interactive,
  resizable,
  backgroundImageClassName,
  lockAspectRatio,
  rooms,
  selectedRoom,
  setSelectedRoom,
  onResize,
  onMove,
}) => {
  const roomIconsArray = useMemo(() => roomIcons ?? [], [roomIcons]);

  const [boxes, setBoxes] = useState<RoomIconsMap>({});
  const [imageDims, setImageDims] = useState<Dimensions>();
  const wrapperRef = useRef(null);

  const onRoomResize = useCallback((width, height) => {
    setImageDims({ width, height });
  }, []);

  const { ref } = useResizeDetector({
    onResize: onRoomResize,
    targetRef: wrapperRef,
  });

  const convertDisplayedCoordToIntrinsic = useCallback(
    (
      val: number,
      dimension: "height" | "width",
      coordinateBoundary: number
    ) => {
      if (!imageDims) return 0;

      return (coordinateBoundary * val) / imageDims[dimension];
    },
    [imageDims]
  );

  useEffect(() => {
    if (!imageDims) return;

    const iconsMap = Object.keys(roomIconsArray).reduce(
      (acc, stringIndex: string) => {
        const index = parseInt(stringIndex);
        return {
          ...acc,
          [index]: {
            ...roomIconsArray[index],
            width: resizable
              ? (imageDims.width * roomIconsArray[index].width) /
                coordinatesBoundary.width
              : roomIconsArray[index].width,
            height: resizable
              ? (imageDims.height * roomIconsArray[index].height) /
                coordinatesBoundary.height
              : roomIconsArray[index].height,
            top:
              (imageDims.height * roomIconsArray[index].top) /
              coordinatesBoundary.height,
            left:
              (imageDims.width * roomIconsArray[index].left) /
              coordinatesBoundary.width,
          },
        };
      },
      {}
    );

    setBoxes(iconsMap);
  }, [
    coordinatesBoundary.height,
    coordinatesBoundary.width,
    imageDims,
    resizable,
    roomIconsArray,
    selectedRoom,
  ]);

  const moveBox = useCallback(
    (id: number, left: number, top: number) => {
      onMove?.({
        left: convertDisplayedCoordToIntrinsic(
          left,
          "width",
          coordinatesBoundary.width
        ),
        top: convertDisplayedCoordToIntrinsic(
          top,
          "height",
          coordinatesBoundary.height
        ),
      });
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        })
      );
    },
    [
      boxes,
      convertDisplayedCoordToIntrinsic,
      coordinatesBoundary.height,
      coordinatesBoundary.width,
      onMove,
    ]
  );

  const resizeBox = useCallback(
    (id: string) => (dimensions: Dimensions) => {
      if (!imageDims) return;

      const { width, height } = dimensions;

      onResize?.({
        width: resizable
          ? (coordinatesBoundary.width * width) / imageDims.width
          : width,
        height: resizable
          ? (coordinatesBoundary.height * height) / imageDims.height
          : height,
      });
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { width, height },
          },
        })
      );
    },
    [
      boxes,
      coordinatesBoundary.height,
      coordinatesBoundary.width,
      imageDims,
      onResize,
      resizable,
    ]
  );

  const [, drop] = useDrop({
    accept: ItemTypes.SUBVENUE_ICON,
    drop: (item: DragItem, monitor) => {
      if (!interactive) return;
      const delta = monitor.getDifferenceFromInitialOffset() as {
        x: number;
        y: number;
      };

      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);
      if (snapToGrid) {
        [left, top] = doSnapToGrid(left, top);
      }

      moveBox(item.itemId, left, top);
    },
  });

  const renderSelectedRoom = useCallback(
    (index: number) => {
      return (
        <>
          <DraggableSubvenue
            itemId={index}
            {...boxes[index]}
            onChangeSize={resizeBox(index.toString())}
            lockAspectRatio={lockAspectRatio}
          />
          {imageDims && interactive && (
            <CustomDragLayer
              snapToGrid={!!snapToGrid}
              iconSize={boxes[Object.keys(boxes)[index]]}
            />
          )}
        </>
      );
    },
    [boxes, imageDims, interactive, lockAspectRatio, resizeBox, snapToGrid]
  );

  const renderRoomsPreview = useMemo(
    () =>
      rooms.map((room, index) =>
        room === selectedRoom ? (
          <div key={`${room.title}-${index}`}>{renderSelectedRoom(index)}</div>
        ) : (
          <div
            className={classNames("Container__room-preview", {
              "Container__room-image--disabled": !room.isEnabled,
            })}
            style={{
              top: `${room.y_percent}%`,
              left: `${room.x_percent}%`,
              width: `${room.width_percent}%`,
              height: `${room.height_percent}%`,
              backgroundImage: `url(${room.image_url})`,
            }}
            key={`${room.title}-${index}`}
            onClick={() => setSelectedRoom(room)}
          >
            <div className="Container__room-title">{room.title}</div>
          </div>
        )
      ),
    [renderSelectedRoom, rooms, selectedRoom, setSelectedRoom]
  );

  return (
    <div ref={drop}>
      <div ref={ref}>
        <ReactResizeDetector handleWidth handleHeight>
          {({ targetRef }) => <span ref={targetRef} />}
        </ReactResizeDetector>
        {!backgroundImage ? (
          <MapBackgroundPlaceholder />
        ) : (
          <img
            alt="draggable background "
            className={`Container__background-image ${backgroundImageClassName}`}
            src={backgroundImage}
          />
        )}

        {backgroundImage && renderRoomsPreview}
      </div>
    </div>
  );
};
