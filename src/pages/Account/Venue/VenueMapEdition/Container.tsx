import React, {
  useCallback,
  useState,
  useMemo,
  CSSProperties,
  useEffect,
} from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableSubvenue } from "./DraggableSubvenue";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import update from "immutability-helper";
import { DragItem } from "./interfaces";
import { DEFAULT_MAP_ICON_URL, PLAYA_ICON_SIDE } from "settings";
import { CustomDragLayer } from "./CustomDragLayer";
import ReactResizeDetector from "react-resize-detector";
import { Dimensions } from "types/utility";

const styles: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
};
export interface SubVenueIconMap {
  [key: string]: {
    top: number;
    left: number;
    url: string;
    width: number;
    height: number;
  };
}

interface PropsType {
  snapToGrid?: boolean;
  iconsMap: SubVenueIconMap;
  backgroundImage: string;
  iconImageStyle: CSSProperties;
  draggableIconImageStyle: CSSProperties;
  onChange?: (val: SubVenueIconMap) => void;
  otherIcons: SubVenueIconMap;
  coordinatesBoundary: number;
  interactive: boolean;
  resizable: boolean;
  onResize?: (rawVal: Dimensions, percentageVal: Dimensions) => void;
  otherIconsStyle?: CSSProperties;
}

export const Container: React.FC<PropsType> = (props) => {
  const {
    snapToGrid,
    iconsMap,
    backgroundImage,
    iconImageStyle,
    onChange,
    otherIcons,
    coordinatesBoundary,
    interactive,
    resizable,
    otherIconsStyle,
  } = props;
  const [boxes, setBoxes] = useState<SubVenueIconMap>(iconsMap);
  const [imageDims, setImageDims] = useState<Dimensions>();

  // trigger the parent callback on boxes change (as a result of movement)
  useEffect(() => {
    if (!imageDims) return;

    const convertDisplayedCoordToIntrinsic = (
      val: number,
      dimension: keyof typeof imageDims
    ) => (coordinatesBoundary * val) / imageDims[dimension];

    //need to return the unscaled values
    const unscaledBoxes = Object.keys(boxes).reduce(
      (acc, val) => ({
        ...acc,
        [val]: {
          ...boxes[val],
          width: (coordinatesBoundary * boxes[val].width) / imageDims.width,
          height: (coordinatesBoundary * boxes[val].height) / imageDims.height,
          top: convertDisplayedCoordToIntrinsic(boxes[val].top, "height"),
          left: convertDisplayedCoordToIntrinsic(boxes[val].left, "width"),
        },
      }),
      {}
    );
    onChange && onChange(unscaledBoxes);
  }, [boxes, onChange, imageDims, coordinatesBoundary]);

  useMemo(() => {
    if (!imageDims) return;
    const copy = Object.keys(iconsMap).reduce(
      (acc, val) => ({
        ...acc,
        [val]: {
          ...iconsMap[val],
          width: (imageDims.width * iconsMap[val].width) / coordinatesBoundary,
          height:
            (imageDims.height * iconsMap[val].height) / coordinatesBoundary,
          top: (imageDims.height * iconsMap[val].top) / coordinatesBoundary,
          left: (imageDims.width * iconsMap[val].left) / coordinatesBoundary,
        },
      }),
      {}
    );

    setBoxes(copy);
  }, [iconsMap, imageDims, coordinatesBoundary]);

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

  return (
    <>
      <div ref={drop} style={styles}>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={(width, height) => setImageDims({ width, height })}
        />
        <img
          alt="draggable background "
          style={{
            width: "100%",
          }}
          src={backgroundImage}
        />
        <div
          style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
        >
          {useMemo(
            () =>
              Object.values(otherIcons).map((icon, index) => (
                <img
                  key={`${icon.top}-${icon.left}-${icon.url}-${index}`}
                  src={icon.url || DEFAULT_MAP_ICON_URL}
                  style={{
                    position: "absolute",
                    top: `${(100 * icon.top) / coordinatesBoundary}%`,
                    left: `${(100 * icon.left) / coordinatesBoundary}%`,
                    width: PLAYA_ICON_SIDE, // @debt should be at the right scale
                    ...otherIconsStyle,
                  }}
                  alt={`${icon.url} map icon`}
                />
              )),
            [otherIcons, coordinatesBoundary, otherIconsStyle]
          )}
        </div>
        {Object.keys(boxes).map((key) => (
          <DraggableSubvenue
            isResizable={resizable}
            key={key}
            id={key}
            imageStyle={iconImageStyle}
            {...boxes[key]}
            onChangeSize={resizeBox(key)}
          />
        ))}
      </div>
      {imageDims && interactive && (
        <CustomDragLayer
          snapToGrid={!!snapToGrid}
          iconSize={boxes[Object.keys(boxes)[0]]} // @debt - this gets the size from the first box
        />
      )}
    </>
  );
};
