import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { UserState } from "types/RelayMessage";
import { throttle } from "lodash";
import { PLAYA_WIDTH_AND_HEIGHT, PLAYA_AVATAR_SIZE } from "settings";
import { useUser } from "hooks/useUser";
import { Overlay } from "react-bootstrap";

interface PropsType {
  serverSentState: UserState | undefined;
  walkMode: boolean;
  onClick: () => void;
  sendUpdatedState: (state: UserState) => void;
  setMyLocation: (x: number, y: number) => void;
}

const ARROW_MOVE_INCREMENT_PX_WALK = 18;
const ARROW_MOVE_INCREMENT_PX_BIKE = 60;
export const KEY_INTERACTION_THROTTLE_MS = 150;

export const MyAvatar: React.FunctionComponent<PropsType> = ({
  serverSentState,
  walkMode,
  sendUpdatedState,
  setMyLocation,
  onClick,
}) => {
  const { profile } = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<UserState>();
  const stateInitialized = useRef(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!serverSentState || stateInitialized.current) return;
    setState(serverSentState);
    setMyLocation(serverSentState.x, serverSentState.y);
    stateInitialized.current = true;
  }, [serverSentState, setMyLocation]);

  useLayoutEffect(() => {
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
          // Work around possible bad state that can happen in the presence of scroll jank
          if (pressedKeys["ArrowLeft"] && pressedKeys["ArrowRight"]) {
            pressedKeys["ArrowLeft"] = false;
            pressedKeys["ArrowRight"] = false;
          }
          if (pressedKeys["ArrowUp"] && pressedKeys["ArrowDown"]) {
            pressedKeys["ArrowUp"] = false;
            pressedKeys["ArrowDown"] = false;
          }
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
          return needsUpdate ? { ...state } : state;
        }
        return state;
      });
    }, KEY_INTERACTION_THROTTLE_MS);

    window.addEventListener("keydown", keyListener);
    window.addEventListener("keyup", keyListener);
    return () => {
      window.removeEventListener("keydown", keyListener);
      window.removeEventListener("keyup", keyListener);
    };
  }, [walkMode, sendUpdatedState]);

  if (!profile || !state) return <></>;

  return (
    <>
      <div
        ref={ref}
        className="avatar me"
        style={{
          top: state.y - PLAYA_AVATAR_SIZE / 2,
          left: state.x - PLAYA_AVATAR_SIZE / 2,
          transition: `all ${KEY_INTERACTION_THROTTLE_MS / 1000}s linear`,
        }}
        onMouseOver={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
      >
        <div className="border-helper">
          <span className="img-vcenter-helper" />
          <img
            className="profile-image"
            src={profile?.pictureUrl}
            alt={profile?.partyName}
            title={profile?.partyName}
          />
        </div>
      </div>
      <Overlay target={ref.current} show={showTooltip}>
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          // @ts-expect-error
          <div {...props} style={{ ...props.style, padding: "10px" }}>
            <div className="playa-venue-text">
              <div className="playa-venue-maininfo">
                <div className="playa-user-title">
                  {profile?.partyName} (you)
                </div>
              </div>
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
};
