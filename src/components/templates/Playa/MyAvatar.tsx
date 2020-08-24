import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { UserState } from "types/RelayMessage";
import { throttle } from "lodash";
import { PLAYA_WIDTH_AND_HEIGHT, PLAYA_AVATAR_SIZE } from "settings";
import { useUser } from "hooks/useUser";

interface PropsType {
  serverSentState: UserState | undefined;
  zoom: number;
  walkMode: boolean;
  sendUpdatedState: (state: UserState) => void;
  setMyLocation: (x: number, y: number) => void;
}

const ARROW_MOVE_INCREMENT_PX_WALK = 3;
const ARROW_MOVE_INCREMENT_PX_BIKE = 10;

export const MyAvatar: React.FunctionComponent<PropsType> = ({
  serverSentState,
  zoom,
  walkMode,
  sendUpdatedState,
  setMyLocation,
}) => {
  const { profile } = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<UserState>();
  const stateInitialized = useRef(false);

  useEffect(() => {
    if (!serverSentState || stateInitialized.current) return;
    setState(serverSentState);
    setMyLocation(serverSentState.x, serverSentState.y);
    stateInitialized.current = true;
  }, [serverSentState, setMyLocation]);

  useLayoutEffect(() => {
    if (ref.current === null) return;

    const pressedKeys: { [key: string]: boolean } = {};
    const keyListener = throttle((event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "ArrowDown":
          pressedKeys[event.key] = event.type === "keydown";
          break;
        default:
          return;
      }
      const moveIncrement = walkMode
        ? ARROW_MOVE_INCREMENT_PX_WALK
        : ARROW_MOVE_INCREMENT_PX_BIKE;
      setState((state) => {
        if (state) {
          let needsUpdate = false;
          if (pressedKeys["ArrowLeft"]) {
            state.x = Math.max(0, state.x - moveIncrement);
            needsUpdate = true;
          }
          if (pressedKeys["ArrowRight"]) {
            state.x = Math.min(
              PLAYA_WIDTH_AND_HEIGHT - 1,
              state.x + moveIncrement
            );
            needsUpdate = true;
          }
          if (pressedKeys["ArrowUp"]) {
            state.y = Math.max(0, state.y - moveIncrement);
            needsUpdate = true;
          }
          if (pressedKeys["ArrowDown"]) {
            state.y = Math.min(
              PLAYA_WIDTH_AND_HEIGHT - 1,
              state.y + moveIncrement
            );
            needsUpdate = true;
          }
          if (needsUpdate) {
            sendUpdatedState(state);
          }
        }
        return state;
      });
    }, 16);

    window.addEventListener("keydown", keyListener);
    window.addEventListener("keyup", keyListener);
    return () => {
      window.removeEventListener("keydown", keyListener);
      window.removeEventListener("keyup", keyListener);
    };
  }, [zoom, walkMode, sendUpdatedState]);

  if (!profile || !state) return <></>;

  return (
    <div
      ref={ref}
      className="avatar me"
      style={{
        top: state.y - PLAYA_AVATAR_SIZE / 2,
        left: state.x - PLAYA_AVATAR_SIZE / 2,
      }}
    >
      <span className="helper" />
      <img
        className="profile-image"
        src={profile?.pictureUrl}
        alt={profile?.partyName}
        title={profile?.partyName}
      />
    </div>
  );
};
