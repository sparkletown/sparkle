import React, { useRef, useEffect, useMemo } from "react";
import { UserState } from "types/RelayMessage";
import { User } from "types/User";
import { throttle } from "lodash";
import { WithId } from "utils/id";
import { toPlayaUnits, toPixels } from "utils/units";

interface PropsType {
  user: WithId<User> | undefined;
  state: UserState;
  me: boolean;
  scale: number;
  zoom: number;
  translateX: number;
  translateY: number;
  sendUpdatedState: (state: UserState) => void;
  setSelectedUserProfile: (user: WithId<User>) => void;
}

export const Avatar: React.FunctionComponent<PropsType> = ({
  user,
  state,
  me,
  scale,
  zoom,
  translateX,
  translateY,
  sendUpdatedState,
  setSelectedUserProfile,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const translateXRef = useRef(translateX);
  const translateYRef = useRef(translateY);

  useEffect(() => {
    if (!me || ref.current === null) return;

    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    const dragStartListener = (event: MouseEvent | TouchEvent) => {
      if (event.which !== 1) {
        return;
      }
      event.preventDefault();
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
      const clientX =
        event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
      const clientY =
        event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

      const x = toPlayaUnits(
        toPixels(translateXRef.current, zoom, scale) + clientX - dragStartX,
        zoom,
        scale
      );
      const y = toPlayaUnits(
        toPixels(translateYRef.current, zoom, scale) + clientY - dragStartY,
        zoom,
        scale
      );
      sendUpdatedState({
        x,
        y,
        speaking: state.speaking,
      });
    }, 20);

    const moveListener = (event: MouseEvent | TouchEvent) => {
      if (dragging && ref.current) {
        event.preventDefault();
        move(event);
      }
    };
    const dragEndListener = (event: MouseEvent | TouchEvent) => {
      if (dragging && ref.current) {
        event.preventDefault();
        move(event);
      }
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
  });

  const top = useMemo(() => toPixels(state.y, zoom, scale) - translateY, [
    state.y,
    scale,
    zoom,
    translateY,
  ]);
  const left = useMemo(() => toPixels(state.x, zoom, scale) - translateX, [
    state.x,
    scale,
    zoom,
    translateX,
  ]);

  if (!user) return <></>;

  return (
    <div
      ref={ref}
      className="avatar"
      style={{ top, left }}
      onClick={() => setSelectedUserProfile(user)}
    >
      <img
        className="profile-image"
        src={user.pictureUrl}
        alt={user.partyName}
        title={user.partyName}
      />
    </div>
  );
};
