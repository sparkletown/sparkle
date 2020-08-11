import React, { useCallback, useState, useMemo } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableSubvenue } from "./DraggableSubvenue";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import update from "immutability-helper";
import { DragItem } from "./interfaces";

const styles: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
};
interface SubVenueIconMap {
  [key: string]: { top: number; left: number; url: string };
}

interface PropsType {
  snapToGrid: boolean;
  iconsMap: SubVenueIconMap;
}

export const Container: React.FC<PropsType> = ({ snapToGrid, iconsMap }) => {
  const [boxes, setBoxes] = useState<SubVenueIconMap>(iconsMap);

  useMemo(() => {
    setBoxes(iconsMap);
  }, [iconsMap]);

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
      <div
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
      >
        <img
          alt="playa3d"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          src={"/burn/playa3d.jpeg"}
        />
      </div>
      {Object.keys(boxes).map((key) => (
        <DraggableSubvenue key={key} id={key} {...boxes[key]} />
      ))}
    </div>
  );
};
