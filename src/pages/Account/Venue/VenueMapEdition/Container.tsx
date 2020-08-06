import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableSubvenue } from "./DraggableSubvenue";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import update from "immutability-helper";
import { DragItem } from "./interfaces";

const styles: React.CSSProperties = {
  width: "100wh",
  height: "100vh",
  position: "relative",
};

interface PropsType {
  snapToGrid: boolean;
}

interface SubVenueIconMap {
  [key: string]: { top: number; left: number; url: string };
}

export const Container: React.FC<PropsType> = ({ snapToGrid }) => {
  const [boxes, setBoxes] = useState<SubVenueIconMap>({
    a: { top: 20, left: 80, url: "/subvenues-icons/explosion.png" },
    b: { top: 180, left: 20, url: "/subvenues-icons/explosion.png" },
  });

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

  const [, drop] = useDrop({
    accept: ItemTypes.SUBVENUE_ICON,
    drop(item: DragItem, monitor) {
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
      return undefined;
    },
  });

  return (
    <div ref={drop} style={styles}>
      {Object.keys(boxes).map((key) => (
        <DraggableSubvenue key={key} id={key} {...boxes[key]} />
      ))}
    </div>
  );
};
