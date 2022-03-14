import React, { useEffect, useMemo } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Resizable } from "re-resizable";

import { Dimensions } from "types/utility";

import { SubVenueIcon } from "./Container";
import { ItemTypes } from "./ItemTypes";

import styles from "./DraggableSubvenue.module.scss";

const getStyles = (
  left: number,
  top: number,
  isDragging: boolean
): React.CSSProperties => ({
  position: "absolute",
  top,
  left,
  opacity: isDragging ? 0 : 1,
  height: isDragging ? 0 : "",
  background: "rgba(147, 124, 99, 0.2)",
});

export type PropsType = SubVenueIcon & {
  onChangeSize?: (newSize: Dimensions) => void;
  lockAspectRatio?: boolean;
  isSaving?: boolean;
  onDragStart?: (id: number) => void;
  itemId: number;
};

export const DraggableSubvenue: React.FC<PropsType> = ({
  url,
  left,
  top,
  width,
  height,
  title,
  onChangeSize,
  lockAspectRatio = false,
  isSaving,
  onDragStart,
  itemId,
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: ItemTypes.SUBVENUE_ICON, itemId, left, top, url },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    if (isDragging) {
      onDragStart && onDragStart(itemId);
    }
  }, [isDragging, itemId, onDragStart]);

  const draggerStyles = useMemo(() => getStyles(left, top, isDragging), [
    left,
    top,
    isDragging,
  ]);

  return (
    <Resizable
      size={{ width, height }}
      style={draggerStyles}
      onResizeStop={(_e, _direction, _ref, d) => {
        const newWidth = width + d.width;
        const newHeight = height + d.height;
        onChangeSize && onChangeSize({ width: newWidth, height: newHeight });
      }}
      lockAspectRatio={lockAspectRatio}
    >
      <div ref={!isSaving ? drag : null} className={styles.dragContainer}>
        {!isSaving && (
          <>
            <div
              className={styles.resizeTab}
              style={{
                top: 0,
                left: 0,
              }}
            />
            <div
              className={styles.resizeTab}
              style={{
                top: 0,
                right: 0,
              }}
            />
            <div
              className={styles.resizeTab}
              style={{
                bottom: 0,
                left: 0,
              }}
            />
            <div
              className={styles.resizeTab}
              style={{
                bottom: 0,
                right: 0,
              }}
            />
          </>
        )}
        <div
          className={styles.resizeableImageContainer}
          style={{ backgroundImage: `url(${url})` }}
        />
      </div>
      <div>{title}</div>
    </Resizable>
  );
};
