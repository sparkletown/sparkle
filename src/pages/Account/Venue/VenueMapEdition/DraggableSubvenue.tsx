import React, { useEffect, CSSProperties } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Resizable } from "re-resizable";
import { Dimensions } from "types/utility";
import { SubVenueIconMap } from "./Container";

function getStyles(
  left: number,
  top: number,
  isDragging: boolean
): React.CSSProperties {
  return {
    position: "absolute",
    top,
    left,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : "",
    background: "rgba(147, 124, 99, 0.2)",
  };
}

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

export const DraggableSubvenue: React.FC<PropsType> = (props) => {
  const {
    id,
    url,
    left,
    top,
    width,
    height,
    onChangeSize,
    isResizable,
    rounded,
    lockAspectRatio = false,
    isSaving,
    onDragStart,
  } = props;
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
          <div
            style={{
              ...styles.resizeableImageContainer,
              borderRadius: rounded ? "50%" : "none",
              backgroundImage: "url(" + url + ")",
            }}
          ></div>
        </div>
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

const styles: Record<string, CSSProperties> = {
  dragContainer: {
    height: "100%",
    display: "flex",
    position: "relative",
  },
  resizeTab: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "white",
    border: "1px solid gray",
  },
  resizeableImageContainer: {
    overflow: "hidden",
    width: "100%",
    flex: 1,
    backgroundPosition: "center",
    backgroundSize: "cover",
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
