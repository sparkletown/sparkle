import React, { CSSProperties, useEffect } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useCss } from "react-use";
import { Resizable } from "re-resizable";

import { Dimensions } from "types/utility";

import { SubVenueIconMap } from "./Container";
import { ItemTypes } from "./ItemTypes";

import "./DraggableSubvenue.scss";

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

export type PropsType = SubVenueIconMap[string] & {
  id: string;
  imageStyle?: CSSProperties;
  onChangeSize?: (newSize: Dimensions) => void;
  isResizable?: boolean;
  rounded: boolean;
  lockAspectRatio?: boolean;
  isSaving?: boolean;
  onDragStart?: (id: number) => void;
};

export const DraggableSubvenue: React.FC<PropsType> = ({
  id,
  url,
  left,
  top,
  width,
  height,
  title,
  isEnabled,
  onChangeSize,
  isResizable,
  rounded,
  lockAspectRatio = false,
  isSaving,
  onDragStart,
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: ItemTypes.SUBVENUE_ICON, id, left, top, url },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    if (isDragging) {
      onDragStart && onDragStart(parseInt(id));
    }
  }, [id, isDragging, onDragStart]);

  const iconStyles = useCss({
    ...styles.resizeableImageContainer,
    borderRadius: rounded ? "50%" : "none",
    opacity: isEnabled ? 1 : 0.5,
    backgroundImage: `url(${url})`,
  });

  if (isResizable) {
    return (
      <Resizable
        size={{ width, height }}
        style={getStyles(left, top, isDragging)}
        onResizeStop={(_e, _direction, _ref, d) => {
          const newWidth = width + d.width;
          const newHeight = height + d.height;
          onChangeSize && onChangeSize({ width: newWidth, height: newHeight });
        }}
        lockAspectRatio={lockAspectRatio}
      >
        <div ref={!isSaving ? drag : null} style={styles.dragContainer}>
          {!isSaving && (
            <>
              <div
                style={{
                  ...styles.resizeTab,
                  top: 0,
                  left: 0,
                }}
              />
              <div
                style={{
                  ...styles.resizeTab,
                  top: 0,
                  right: 0,
                }}
              />
              <div
                style={{
                  ...styles.resizeTab,
                  bottom: 0,
                  left: 0,
                }}
              />
              <div
                style={{
                  ...styles.resizeTab,
                  bottom: 0,
                  right: 0,
                }}
              />
            </>
          )}
          <div className={iconStyles} />
        </div>
        <div className="DraggableSubvenue__title">{title}</div>
      </Resizable>
    );
  }

  return (
    <div
      style={{
        ...getStyles(left, top, isDragging),
        width,
        height,
      }}
    >
      <div ref={drag} style={styles.imageContainer}>
        <img
          src={url}
          alt="subvenue-icon"
          style={{ ...styles.image, borderRadius: rounded ? "50%" : "none" }}
        />
      </div>
    </div>
  );
};

// @debt This styles syntax is legacy and should be refactored
const styles: Record<string, CSSProperties> = {
  dragContainer: {
    height: "100%",
    display: "flex",
    position: "relative",
    border: " 1px solid var(--content--over)",
  },
  resizeTab: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "white",
    border: " 1px solid var(--content--over)",
  },
  resizeableImageContainer: {
    overflow: "hidden",
    width: "100%",
    flex: 1,
    backgroundPosition: "center",
    backgroundSize: "contain,cover",
    backgroundRepeat: "no-repeat",
  },
  resizeableImage: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    height: "100%",
    display: "flex",
    position: "relative",
  },
  image: {
    width: "100%",
    flex: 1,
  },
};
