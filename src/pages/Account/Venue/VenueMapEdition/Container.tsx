import React, {
  useCallback,
  useState,
  useMemo,
  CSSProperties,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableSubvenue } from "./DraggableSubvenue";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import update from "immutability-helper";
import { DragItem } from "./interfaces";
import { DEFAULT_MAP_ICON_URL } from "settings";
import { CustomDragLayer } from "./CustomDragLayer";
import ReactResizeDetector from "react-resize-detector";
import { Dimensions } from "types/utility";
import { RoomData_v2 } from "types/rooms";

const styles: React.CSSProperties = {
  width: "100%",
  position: "relative",
};
export interface SubVenueIconMap {
  [key: string]: {
    top: number;
    left: number;
    url: string;
    width: number;
    height: number;
    roomIndex?: number;
  };
}

interface CoordinatesBoundary {
  width: number;
  height: number;
}

interface PropsType {
  snapToGrid?: boolean;
  iconsMap: SubVenueIconMap;
  backgroundImage: string;
  iconImageStyle?: CSSProperties; // This is not being used ATM
  draggableIconImageStyle?: CSSProperties; // This is not being used ATM
  onChange?: (val: SubVenueIconMap) => void;
  otherIcons: SubVenueIconMap;
  onOtherIconClick?: (key: string) => void;
  coordinatesBoundary: CoordinatesBoundary;
  interactive: boolean;
  resizable: boolean;
  onResize?: (rawVal: Dimensions, percentageVal: Dimensions) => void;
  otherIconsStyle?: CSSProperties;
  rounded?: boolean;
  backgroundImageStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  lockAspectRatio?: boolean;
  rooms: RoomData_v2[];
  selectedRoom: RoomData_v2 | undefined;
  setSelectedRoom: Dispatch<SetStateAction<RoomData_v2 | undefined>>;
}

export const Container: React.FC<PropsType> = (props) => {
  const {
    snapToGrid,
    iconsMap,
    backgroundImage,
    iconImageStyle,
    onChange,
    otherIcons,
    onOtherIconClick,
    coordinatesBoundary,
    interactive,
    resizable,
    rounded,
    otherIconsStyle,
    backgroundImageStyle,
    containerStyle,
    lockAspectRatio,
    rooms,
    selectedRoom,
    setSelectedRoom
  } = props;
  const [boxes, setBoxes] = useState<SubVenueIconMap>(iconsMap);
  const [imageDims, setImageDims] = useState<Dimensions>();

  useEffect(() => {
    if (!imageDims) return;

    const convertDisplayedCoordToIntrinsic = (
      val: number,
      dimension: keyof typeof imageDims,
      coordinateBoundary: number
    ) => (coordinateBoundary * val) / imageDims[dimension];

    //need to return the unscaled values
    const unscaledBoxes = Object.keys(boxes).reduce(
      (acc, val) => ({
        ...acc,
        [val]: {
          ...boxes[val],
          // resizable expects a percentage (for rooms), whereas non-resizable expects pixels
          width: resizable
            ? (coordinatesBoundary.width * boxes[val].width) / imageDims.width
            : boxes[val].width,
          height: resizable
            ? (coordinatesBoundary.height * boxes[val].height) /
              imageDims.height
            : boxes[val].height,
          top: convertDisplayedCoordToIntrinsic(
            boxes[val].top,
            "height",
            coordinatesBoundary.height
          ),
          left: convertDisplayedCoordToIntrinsic(
            boxes[val].left,
            "width",
            coordinatesBoundary.width
          ),
        },
      }),
      {}
    );

    onChange && onChange(unscaledBoxes);
  }, [
    boxes,
    onChange,
    imageDims,
    resizable,
    coordinatesBoundary.width,
    coordinatesBoundary.height,
  ]);

  useMemo(() => {
    if (!imageDims) return;
    const copy = Object.keys(iconsMap).reduce(
      (acc, val) => ({
        ...acc,
        [val]: {
          ...iconsMap[val],
          width: resizable
            ? (imageDims.width * iconsMap[val].width) /
              coordinatesBoundary.width
            : iconsMap[val].width,
          height: resizable
            ? (imageDims.height * iconsMap[val].height) /
              coordinatesBoundary.height
            : iconsMap[val].height,
          top:
            (imageDims.height * iconsMap[val].top) / coordinatesBoundary.height,
          left:
            (imageDims.width * iconsMap[val].left) / coordinatesBoundary.width,
        },
      }),
      {}
    );

    setBoxes(copy);
  }, [
    coordinatesBoundary.height,
    coordinatesBoundary.width,
    iconsMap,
    imageDims,
    resizable,
  ]);

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        })
      );
    },
    [boxes]
  );

  const resizeBox = useCallback(
    (id: string) => (dimensions: Dimensions) => {
      const { width, height } = dimensions;
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { width, height },
          },
        })
      );
    },
    [boxes]
  );

  const [, drop] = useDrop({
    accept: ItemTypes.SUBVENUE_ICON,
    drop(item: DragItem, monitor) {
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

      moveBox(item.id, left, top);
    },
  });

  const renderSelectedRoom = (index: number) => {
    return (
      <>
        <DraggableSubvenue
          isResizable={resizable}
          key={index}
          id={index.toString()}
          imageStyle={iconImageStyle}
          rounded={!!rounded}
          {...boxes[index]}
          onChangeSize={resizeBox(index.toString())}
          lockAspectRatio={lockAspectRatio}
        />
      {imageDims && interactive && (
        <CustomDragLayer
          snapToGrid={!!snapToGrid}
          rounded={!!rounded}
          iconSize={boxes[Object.keys(boxes)[index]]} // @debt - this gets the size from the first box
        />
      )}
      </>
    )
  }

  return (
    <>
      <div ref={drop} style={{ ...styles, ...containerStyle }}>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={(width, height) => setImageDims({ width, height })}
        />
        <img
          alt="draggable background "
          style={{
            width: "100%",
            ...backgroundImageStyle,
          }}
          src={backgroundImage}
        />

        {backgroundImage &&
          rooms.map((room, index) => (
            room === selectedRoom ? (
              <>
              {renderSelectedRoom(index)}
              </>
            ) : (
              <div
              className="map-preview__room"
              key={room.title}
              onClick={() => setSelectedRoom(room)}
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
            )
          ))}

      </div>

    </>
  );
};
