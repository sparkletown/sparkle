import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { UserState } from "types/RelayMessage";
import { User } from "types/User";
import { throttle } from "lodash";
import { WithId } from "utils/id";

interface PropsType {
  user: WithId<User> | undefined;
  state: UserState;
  scale: number;
  zoom: number;
  sendUpdatedState: (state: UserState) => void;
}

export const MyAvatar: React.FunctionComponent<PropsType> = ({
  user,
  state,
  scale,
  zoom,
  sendUpdatedState,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();

  const stateUpdated = useCallback(() => {
    if (x && y && state) sendUpdatedState({ x, y, speaking: state.speaking });
  }, [x, y, state, sendUpdatedState]);

  useEffect(() => {
    if (ref.current === null) return;

    let dragging = false;
    let movedSoFarX = 0;
    let movedSoFarY = 0;
    let dragStartX = 0;
    let dragStartY = 0;

    const dragStartListener = (event: MouseEvent | TouchEvent) => {
      if (event.which !== 1) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dragging = true;
      if (event instanceof TouchEvent) {
        dragStartX = event.touches[0].clientX;
        dragStartY = event.touches[0].clientY;
      } else {
        dragStartX = event.clientX;
        dragStartY = event.clientY;
      }
    };
    const move = throttle((event: MouseEvent | TouchEvent) => {
      // since this function is asynchronous due to throttling, it's possible that dragging is false in moveListener but this is still called
      if (!dragging) return;

      let diffX: number;
      let diffY: number;

      if (event instanceof TouchEvent) {
        diffX = event.touches[0].clientX - dragStartX;
        diffY = event.touches[0].clientY - dragStartY;
      } else {
        diffX = event.clientX - dragStartX;
        diffY = event.clientY - dragStartY;
      }

      setX((x) => x && x + (diffX - movedSoFarX) / zoom / scale);
      setY((y) => y && y + (diffY - movedSoFarY) / zoom / scale);
      stateUpdated();

      movedSoFarX = diffX;
      movedSoFarY = diffY;
    }, 25);
    const moveListener = (event: MouseEvent | TouchEvent) => {
      if (dragging) {
        event.preventDefault();
        event.stopPropagation();
        move(event);
      }
    };
    const dragEndListener = (event: MouseEvent | TouchEvent) => {
      if (dragging && ref.current) {
        event.preventDefault();
        event.stopPropagation();
      }

      // reset drag state
      dragStartX = 0;
      dragStartY = 0;
      movedSoFarX = 0;
      movedSoFarY = 0;
      dragging = false;
    };

    ref.current.addEventListener("mousedown", dragStartListener);
    ref.current.addEventListener("touchstart", dragStartListener);
    window.addEventListener("mousemove", moveListener);
    window.addEventListener("touchmove", moveListener);
    window.addEventListener("mouseup", dragEndListener);
    window.addEventListener("touchend", dragEndListener);

    const refCurrent = ref.current;
    return () => {
      refCurrent.removeEventListener("mousedown", dragStartListener);
      refCurrent.removeEventListener("touchstart", dragStartListener);
      window.removeEventListener("mousemove", moveListener);
      window.removeEventListener("touchmove", moveListener);
      window.removeEventListener("mouseup", dragEndListener);
      window.addEventListener("touchend", dragEndListener);
    };
  }, [scale, zoom, stateUpdated]);

  const top = useMemo(() => y && y * scale, [y, scale]);
  const left = useMemo(() => x && x * scale, [x, scale]);

  if (!user) return <></>;

  return (
    <div ref={ref} className="avatar me" style={{ top, left }}>
      <img
        className="profile-image"
        src={user.pictureUrl}
        alt={user.partyName}
        title={user.partyName}
      />
    </div>
  );
};
