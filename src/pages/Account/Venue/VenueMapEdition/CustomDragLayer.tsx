import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";

import { Dimensions } from "types/utility";

import { ItemTypes } from "./ItemTypes";
import { snapToGrid } from "./snapToGrid";
import { SubvenueDragPreview } from "./SubvenueDragPreview";

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

const getItemStyles = (
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  isSnapToGrid: boolean
) => {
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
};

export interface CustomDragLayerProps {
  snapToGrid: boolean;
  iconSize: Dimensions;
  rounded: boolean;
}

export const CustomDragLayer: React.FC<CustomDragLayerProps> = (props) => {
  const { iconSize, rounded } = props;
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const renderItem = () => {
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
  };

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
