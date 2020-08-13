import React, {
  useCallback,
  useState,
  useMemo,
  CSSProperties,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DraggableSubvenue } from "./DraggableSubvenue";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import update from "immutability-helper";
import { DragItem } from "./interfaces";
import {
  PLAYA_WIDTH_AND_HEIGHT,
  DEFAULT_MAP_ICON_URL,
  PLAYA_ICON_SIDE,
} from "settings";
import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "react-redux-firebase";

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
  backgroundImage: string;
  iconImageStyle: CSSProperties;
  onChange: (val: SubVenueIconMap) => void;
}

export const Container: React.FC<PropsType> = (props) => {
  const {
    snapToGrid,
    iconsMap,
    backgroundImage,
    iconImageStyle,
    onChange,
  } = props;
  const [boxes, setBoxes] = useState<SubVenueIconMap>(iconsMap);
  const [scale, setScale] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);

  // trigger the parent callback on boxes change (as a result of movement)
  useEffect(() => {
    //need to return the unscaled values
    const unscaledBoxes = Object.keys(boxes).reduce(
      (acc, val) => ({
        ...acc,
        [val]: {
          ...boxes[val],
          top: boxes[val].top / scale,
          left: boxes[val].left / scale,
        },
      }),
      {}
    );
    onChange(unscaledBoxes);
  }, [boxes, onChange, scale]);

  useLayoutEffect(() => {
    mapRef?.current?.getBoundingClientRect().width &&
      setScale(
        mapRef.current.getBoundingClientRect().width / PLAYA_WIDTH_AND_HEIGHT
      );
  }, [setScale, mapRef]);

  useLayoutEffect(() => {
    const rescale = () => {
      mapRef?.current?.getBoundingClientRect().width &&
        setScale(
          mapRef.current.getBoundingClientRect().width / PLAYA_WIDTH_AND_HEIGHT
        );
    };

    window.addEventListener("resize", rescale);
    return () => {
      window.removeEventListener("resize", rescale);
    };
  }, []);

  useFirestoreConnect("venues");
  const venues = useSelector((state) => state.firestore.ordered.venues);
  const placedVenues = useMemo(
    () => venues?.filter((v) => v.placement?.x && v.placement?.y),
    [venues]
  );

  useMemo(() => {
    const copy = Object.keys(iconsMap).reduce(
      (acc, val) => ({
        ...acc,
        [val]: {
          ...iconsMap[val],
          top: iconsMap[val].top * scale,
          left: iconsMap[val].left * scale,
        },
      }),
      {}
    );

    setBoxes(copy);
  }, [iconsMap, scale]);

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
        ref={mapRef}
      >
        <img
          alt="draggable background "
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          src={backgroundImage}
        />
        {useMemo(
          () =>
            placedVenues?.map((v) => (
              <img
                key={v.id}
                src={v.mapIconImageUrl || DEFAULT_MAP_ICON_URL}
                style={{
                  position: "absolute",
                  top: (v.placement?.x || 0) * scale,
                  left: (v.placement?.y || 0) * scale,
                  width: PLAYA_ICON_SIDE, // @debt should be at the right scale
                  opacity: 0.4,
                }}
                alt={`${v.name} map icon`}
              />
            )),
          [placedVenues, scale]
        )}
      </div>
      {Object.keys(boxes).map((key) => (
        <DraggableSubvenue
          key={key}
          id={key}
          imageStyle={iconImageStyle}
          {...boxes[key]}
        />
      ))}
    </div>
  );
};
