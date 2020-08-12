import React, { useEffect, CSSProperties } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { getEmptyImage } from "react-dnd-html5-backend";

function getStyles(
  left: number,
  top: number,
  isDragging: boolean
): React.CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: "absolute",
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : "",
  };
}

export interface PropsType {
  id: string;
  url: string;
  left: number;
  top: number;
  imageStyle: CSSProperties;
}

export const DraggableSubvenue: React.FC<PropsType> = (props) => {
  const { id, url, left, top, imageStyle } = props;
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: ItemTypes.SUBVENUE_ICON, id, left, top, url },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div ref={drag} style={getStyles(left, top, isDragging)}>
      <img src={url} alt="subvenue-icon" style={imageStyle} />
    </div>
  );
};
