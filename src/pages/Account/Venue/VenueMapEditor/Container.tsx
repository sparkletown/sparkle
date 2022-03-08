import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDrop } from "react-dnd";
import ReactResizeDetector, { useResizeDetector } from "react-resize-detector";
import update from "immutability-helper";

import { Dimensions } from "types/utility";
import { SafeZone } from "types/venues";

import {
  convertPercToRelativePx,
  convertRelativePxToPerc,
} from "utils/mapPositioning";

import { CustomDragLayer } from "./CustomDragLayer";
import { DraggableSubvenue } from "./DraggableSubvenue";
import { DragItem } from "./interfaces";
import { ItemTypes } from "./ItemTypes";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";

import styles from "./Container.module.scss";

export interface SubVenueIcon {
  title?: string;
  top: number;
  left: number;
  url?: string;
  width: number;
  height: number;
  roomIndex?: number;
  isEnabled?: boolean;
}

interface PropsType {
  snapToGrid?: boolean;
  iconsMap: SubVenueIcon[];
  backgroundImage: string;
  onChange?: (val: SubVenueIcon[]) => void;
  safeZone: SafeZone;
  interactive: boolean;
  onResize?: (rawVal: Dimensions, percentageVal: Dimensions) => void;
  lockAspectRatio?: boolean;
  isSaving?: boolean;
}

export const Container: React.FC<PropsType> = ({
  snapToGrid,
  iconsMap: iconsMap100,
  backgroundImage,
  onChange,
  safeZone: safeZone100,
  interactive,
  lockAspectRatio,
  isSaving,
}) => {
  // For historical reasons, the icons coming in have all dimensions specified
  // as percentages in the 0 to 100 range rather than 0 to 1. Convert them here
  // to make further calculations easier
  const iconsMapPerc = useMemo(
    () =>
      iconsMap100.map((icon) => ({
        ...icon,
        width: icon.width / 100,
        height: icon.height / 100,
        top: icon.top / 100,
        left: icon.left / 100,
      })),
    [iconsMap100]
  );
  const [boxes, setBoxes] = useState<SubVenueIcon[]>(iconsMapPerc);
  const [imageDims, setImageDims] = useState<Dimensions>();
  const [dragBoxId, setDragBoxId] = useState<number>(0);
  const wrapperRef = useRef(null);

  // For historical reasons, the safe zone passed in is 0 to 100 rather than
  // 0 to 1, convert it to make calculations later easier.
  const safeZonePerc = useMemo(
    () => ({
      width: safeZone100.width / 100,
      height: safeZone100.height / 100,
    }),
    [safeZone100]
  );

  const onRoomResize = useCallback((width, height) => {
    setImageDims({ width, height });
  }, []);

  const { ref } = useResizeDetector({
    onResize: onRoomResize,
    targetRef: wrapperRef,
  });

  const setDragItemId = useCallback((id: number) => {
    setDragBoxId(id);
  }, []);

  // trigger the parent callback on boxes change (as a result of movement)
  useEffect(() => {
    if (!imageDims || !imageDims.height || !imageDims.width) return;

    //need to return the unscaled values
    const unscaledBoxes = boxes.map(
      (box) =>
        ({
          ...box,
          ...convertRelativePxToPerc({ rect: box, imageDims, safeZonePerc }),
        } as SubVenueIcon)
    );

    onChange && onChange(unscaledBoxes);
  }, [boxes, onChange, imageDims, safeZonePerc]);

  useMemo(() => {
    if (!imageDims || !imageDims.width || !imageDims.height) return;

    const copy = iconsMapPerc.map(
      (mapIcon) =>
        ({
          ...mapIcon,
          ...convertPercToRelativePx({
            rect: mapIcon,
            imageDims,
            safeZonePerc,
          }),
        } as SubVenueIcon)
    );

    setBoxes(copy);
  }, [iconsMapPerc, imageDims, safeZonePerc]);

  const moveBox = useCallback(
    (id: number, left: number, top: number) => {
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
    (id: number) => (dimensions: Dimensions) => {
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

  return (
    <>
      <div ref={drop}>
        <div ref={ref} className={styles.mapContainer}>
          <ReactResizeDetector handleWidth handleHeight>
            {({ targetRef }) => <span ref={targetRef} />}
          </ReactResizeDetector>
          <img
            alt="draggable background"
            className={styles.draggableBackground}
            src={backgroundImage}
          />
          {boxes.map((box, idx) => (
            <DraggableSubvenue
              key={idx}
              itemId={idx}
              {...box}
              onChangeSize={resizeBox(idx)}
              lockAspectRatio={lockAspectRatio}
              onDragStart={setDragItemId}
              isSaving={isSaving}
            />
          ))}
        </div>
      </div>
      {imageDims && interactive && (
        <CustomDragLayer
          snapToGrid={!!snapToGrid}
          iconSize={boxes[dragBoxId]}
        />
      )}
    </>
  );
};
