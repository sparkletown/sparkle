import React from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { SubvenueDragPreview } from "./SubvenueDragPreview";
import { snapToGrid } from "./snapToGrid";
import { Dimensions } from "types/utility";

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  isSnapToGrid: boolean
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentOffset;

  if (isSnapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export interface CustomDragLayerProps {
  snapToGrid: boolean;
  iconSize: Dimensions;
  rounded: boolean;
}

export const CustomDragLayer: React.FC<CustomDragLayerProps> = (props) => {
  const { iconSize, rounded } = props;
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  function renderItem() {
    switch (itemType) {
      case ItemTypes.SUBVENUE_ICON:
        return (
          <SubvenueDragPreview
            url={item.url}
            imageStyle={{
              ...iconSize,
              borderRadius: rounded ? "50%" : "none",
            }}
            containerStyle={{
              borderRadius: "50%",
              animation: "ripple 4s linear infinite",
            }}
          />
        );
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}
      >
        {renderItem()}
      </div>
    </div>
  );
};
