import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  forwardRef,
} from "react";
import {
  UserState,
  UserStateKey,
  UserVideoState,
  stateBoolean,
} from "types/RelayMessage";
import { throttle } from "lodash";
import { PLAYA_WIDTH_AND_HEIGHT, PLAYA_AVATAR_SIZE } from "settings";
import { useUser } from "hooks/useUser";

interface PropsType {
  serverSentState: UserState | undefined;
  bike: boolean | undefined;
  videoState: string | undefined;
  onClick: (event: React.MouseEvent) => void;
  onMouseOver: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
  sendUpdatedState: (state: UserState) => void;
  setMyLocation: (x: number, y: number) => void;
  setBikeMode: (bikeMode: boolean | undefined) => void;
  setVideoState: (state: string | undefined) => void;
  setAvatarVisible: (visibility: boolean) => void;
}

const ARROW_MOVE_INCREMENT_PX_WALK = 6;
const ARROW_MOVE_INCREMENT_PX_BIKE = 20;
const KEY_INTERACTION_THROTTLE_MS = 25;

const MyAvatar: React.ForwardRefRenderFunction<HTMLDivElement, PropsType> = (
  {
    serverSentState,
    bike,
    videoState,
    onClick,
    onMouseOver,
    onMouseLeave,
    sendUpdatedState,
    setMyLocation,
    setBikeMode,
    setVideoState,
    setAvatarVisible,
  },
  ref
) => {
  const { profile } = useUser();
  const [state, setState] = useState<UserState>();
  const stateInitialized = useRef(false);

  useEffect(() => {
    if (!serverSentState || stateInitialized.current) return;
    setState(serverSentState);
    setMyLocation(serverSentState.x, serverSentState.y);
    setBikeMode(stateBoolean(serverSentState, UserStateKey.Bike));
    setVideoState(serverSentState?.state?.[UserStateKey.Video]);
    setAvatarVisible(
      stateBoolean(serverSentState, UserStateKey.Visible) !== false
    );
    stateInitialized.current = true;
  }, [
    serverSentState,
    setMyLocation,
    setBikeMode,
    setVideoState,
    setAvatarVisible,
  ]);

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
      const moveIncrement = bike
        ? ARROW_MOVE_INCREMENT_PX_BIKE
        : ARROW_MOVE_INCREMENT_PX_WALK;
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
  }, [bike, sendUpdatedState]);

  useEffect(() => {
    setState((state) => {
      if (!state) return state;
      const onBike = state?.state?.[UserStateKey.Bike] === true.toString();
      const video = state?.state?.[UserStateKey.Video];
      const needsUpdate = bike !== onBike || video !== videoState;
      if (!needsUpdate) return state;

      if (!state.state) {
        state.state = {};
      }
      if (bike !== undefined) state.state[UserStateKey.Bike] = bike.toString();
      if (videoState !== undefined)
        state.state[UserStateKey.Video] = videoState;
      sendUpdatedState(state);
      return { ...state };
    });
  }, [bike, videoState, sendUpdatedState]);

  if (!profile || !state) return <></>;

  const visible = stateBoolean(state, UserStateKey.Visible) !== false;

  return visible ? (
    <div
      className="avatar-container"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        className="avatar me"
        style={{
          top: state.y - PLAYA_AVATAR_SIZE / 2,
          left: state.x - PLAYA_AVATAR_SIZE / 2,
        }}
        ref={ref}
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
      <div
        className={`chatzone me ${
          videoState === UserVideoState.Locked ? "locked" : ""
        }
        ${videoState === UserVideoState.Open ? "open" : ""}`}
        style={{
          top: state.y - PLAYA_AVATAR_SIZE * 1.5,
          left: state.x - PLAYA_AVATAR_SIZE * 1.5,
        }}
      />
      <div
        className={`mode-badge ${bike ? "bike" : "walk"}`}
        style={{
          top: state.y + PLAYA_AVATAR_SIZE / 3,
          left: state.x - PLAYA_AVATAR_SIZE / 4,
        }}
      />
    </div>
  ) : (
    <></>
  );
};

export default forwardRef(MyAvatar);
