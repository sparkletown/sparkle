import React, { forwardRef, useEffect, useRef, useState } from "react";
import { throttle } from "lodash";

import {
  DEFAULT_PARTY_NAME,
  PLAYA_AVATAR_SIZE,
  PLAYA_HEIGHT,
  PLAYA_WIDTH,
} from "settings";

import {
  stateBoolean,
  UserState,
  UserStateKey,
  UserVideoState,
} from "types/RelayMessage";

import { getLinkFromText } from "utils/getLinkFromText";

import { useUser } from "hooks/useUser";

import AvatarImage from "./AvatarImage";
import AvatarPartygoers from "./AvatarPartygoers";
import { Shout } from "./Playa";

interface PropsType {
  useProfilePicture: boolean;
  serverSentState: UserState | undefined;
  bike: boolean | undefined;
  videoState: string | undefined;
  shouts: Shout[];
  movingUp: boolean;
  movingDown: boolean;
  movingLeft: boolean;
  movingRight: boolean;
  onClick: (event: React.MouseEvent) => void;
  onMouseOver: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
  sendUpdatedState: (state: UserState) => void;
  setMyLocation: (x: number, y: number) => void;
  setBikeMode: (bikeMode: boolean | undefined) => void;
  setVideoState: (state: string | undefined) => void;
}

const ARROW_MOVE_INCREMENT_PX_WALK = 2;
const ARROW_MOVE_INCREMENT_PX_BIKE = 7;
const KEY_INTERACTION_THROTTLE_MS = 16;
const ARROW_INTERACTION_THROTTLE_MS = 16;

const MyAvatar: React.ForwardRefRenderFunction<HTMLDivElement, PropsType> = (
  {
    useProfilePicture,
    serverSentState,
    bike,
    videoState,
    shouts,
    movingUp,
    movingDown,
    movingLeft,
    movingRight,
    onClick,
    onMouseOver,
    onMouseLeave,
    sendUpdatedState,
    setMyLocation,
    setBikeMode,
    setVideoState,
  },
  ref
) => {
  const { profile, user } = useUser();
  const [state, setState] = useState<UserState>();
  const stateInitialized = useRef(false);
  const stateRef = useRef(state);

  useEffect(() => {
    if (!serverSentState || stateInitialized.current) return;
    setState(serverSentState);
    setMyLocation(serverSentState.x, serverSentState.y);
    setBikeMode(stateBoolean(serverSentState, UserStateKey.Bike));
    setVideoState(serverSentState?.state?.[UserStateKey.Video]);
    stateInitialized.current = true;
  }, [serverSentState, setMyLocation, setBikeMode, setVideoState]);

  const arrowMoveIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const buttonMove = () => {
      if (!stateRef.current) return;
      const moveIncrement = bike
        ? ARROW_MOVE_INCREMENT_PX_BIKE
        : ARROW_MOVE_INCREMENT_PX_WALK;
      let needsUpdate = false;
      if (movingLeft && !movingRight) {
        stateRef.current.x = Math.max(0, stateRef.current.x - moveIncrement);
        needsUpdate = true;
      }
      if (movingRight && !movingLeft) {
        stateRef.current.x = Math.min(
          PLAYA_WIDTH - 1,
          stateRef.current.x + moveIncrement
        );
        needsUpdate = true;
      }
      if (movingUp && !movingDown) {
        stateRef.current.y = Math.max(0, stateRef.current.y - moveIncrement);
        needsUpdate = true;
      }
      if (movingDown && !movingUp) {
        stateRef.current.y = Math.min(
          PLAYA_HEIGHT - 1,
          stateRef.current.y + moveIncrement
        );
        needsUpdate = true;
      }
      if (needsUpdate) {
        setState({ ...stateRef.current });
        sendUpdatedState(stateRef.current);
      }
    };
    if (movingUp || movingDown || movingLeft || movingRight) {
      arrowMoveIntervalRef.current = setInterval(
        buttonMove,
        ARROW_INTERACTION_THROTTLE_MS
      );
    } else if (arrowMoveIntervalRef.current) {
      clearInterval(arrowMoveIntervalRef.current);
      arrowMoveIntervalRef.current = null;
    }
  }, [bike, movingUp, movingDown, movingRight, movingLeft, sendUpdatedState]);

  useEffect(() => {
    const pressedKeys: { [key: string]: boolean } = {};
    const move = throttle(() => {
      let needsUpdate = false;
      if (stateRef.current) {
        const moveIncrement = bike
          ? ARROW_MOVE_INCREMENT_PX_BIKE
          : ARROW_MOVE_INCREMENT_PX_WALK;

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
          stateRef.current.x = Math.max(0, stateRef.current.x - moveIncrement);
          needsUpdate = true;
        }
        if (pressedKeys["ArrowRight"]) {
          stateRef.current.x = Math.min(
            PLAYA_WIDTH - 1,
            stateRef.current.x + moveIncrement
          );
          needsUpdate = true;
        }
        if (pressedKeys["ArrowUp"]) {
          stateRef.current.y = Math.max(0, stateRef.current.y - moveIncrement);
          needsUpdate = true;
        }
        if (pressedKeys["ArrowDown"]) {
          stateRef.current.y = Math.min(
            PLAYA_HEIGHT - 1,
            stateRef.current.y + moveIncrement
          );
          needsUpdate = true;
        }
      }
      if (stateRef.current && needsUpdate) {
        setState({ ...stateRef.current });
        sendUpdatedState(stateRef.current);
      }
      if (Object.keys(pressedKeys).find((k) => pressedKeys[k] === true)) {
        requestAnimationFrame(move);
      }
    }, KEY_INTERACTION_THROTTLE_MS);
    const keyListener = (event: KeyboardEvent) => {
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
      if (Object.keys(pressedKeys).find((k) => pressedKeys[k] === true)) {
        requestAnimationFrame(move);
      }
    };

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
      stateRef.current = state;
      const relayStateBike =
        state?.state?.[UserStateKey.Bike] === true.toString();
      const relayStateVideo = state?.state?.[UserStateKey.Video];
      const needsUpdate =
        bike !== relayStateBike || videoState !== relayStateVideo;
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

  if (!profile || !state || !user) return <></>;

  const isVideoRoomOwnedByMe = profile.video?.inRoomOwnedBy === user.uid;

  return (
    <div
      className="avatar-container"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {isVideoRoomOwnedByMe && (
        <AvatarPartygoers
          useProfilePicture={useProfilePicture}
          state={state}
          user={{ id: user.uid, ...profile }}
        />
      )}
      <div
        className="avatar me"
        style={{
          top: state.y - PLAYA_AVATAR_SIZE * 0.75,
          left: state.x - PLAYA_AVATAR_SIZE * 0.75,
        }}
        ref={ref}
      >
        {!isVideoRoomOwnedByMe && (
          <div className={`avatar-name-container`}>
            {profile.anonMode ? DEFAULT_PARTY_NAME : profile.partyName}
          </div>
        )}
        <div className="border-helper">
          <span className="img-vcenter-helper" />
          <AvatarImage
            user={{ ...profile, id: user.uid }}
            useProfilePicture={useProfilePicture}
          />
        </div>
      </div>
      <div
        className={`chatzone me ${
          videoState === UserVideoState.Locked ? "locked" : ""
        } ${
          (videoState === UserVideoState.Open &&
            !profile.video?.inRoomOwnedBy) ||
          !videoState
            ? "open-me"
            : ""
        } ${
          isVideoRoomOwnedByMe
            ? "busy-me"
            : profile.video?.inRoomOwnedBy
            ? "busy"
            : ""
        }
        `}
        style={{
          top: state.y - PLAYA_AVATAR_SIZE * 2.25,
          left: state.x - PLAYA_AVATAR_SIZE * 2.25,
        }}
      >
        {isVideoRoomOwnedByMe && (
          <div className="video_chat-status">
            {profile.partyName}&apos;s
            <br />
            live video chat
          </div>
        )}
      </div>
      <div
        className={`mode-badge ${bike ? "bike" : "walk"}`}
        style={{
          top: state.y + PLAYA_AVATAR_SIZE / 3,
          left: state.x - PLAYA_AVATAR_SIZE / 4,
        }}
      />

      {shouts?.map((shout, index) => (
        <div
          className="shout split-words"
          style={{
            top: state.y,
            left: state.x,
          }}
          key={index}
        >
          {getLinkFromText(shout.text)}
        </div>
      ))}
    </div>
  );
};

export default forwardRef(MyAvatar);
