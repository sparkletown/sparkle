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
  stateBoolean,
  UserVideoState,
} from "types/RelayMessage";
import { throttle } from "lodash";
import { PLAYA_WIDTH_AND_HEIGHT, PLAYA_AVATAR_SIZE } from "settings";
import { useUser } from "hooks/useUser";
import { Shout } from "./Playa";
import { getLinkFromText } from "utils/getLinkFromText";
import AvatarPartygoers from "./AvatarPartygoers";

interface PropsType {
  serverSentState: UserState | undefined;
  bike: boolean | undefined;
  videoState: string | undefined;
  away: boolean | undefined;
  heartbeat: number | undefined;
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
  setAway: (away: boolean) => void;
  setHeartbeat: (heartbeat: number | undefined) => void;
}

const ARROW_MOVE_INCREMENT_PX_WALK = 6;
const ARROW_MOVE_INCREMENT_PX_BIKE = 20;
const KEY_INTERACTION_THROTTLE_MS = 25;
const ARROW_INTERACTION_THROTTLE_MS = 100;

const MyAvatar: React.ForwardRefRenderFunction<HTMLDivElement, PropsType> = (
  {
    serverSentState,
    bike,
    videoState,
    away,
    heartbeat,
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
    setAway,
    setHeartbeat,
  },
  ref
) => {
  const { profile, user } = useUser();
  const [state, setState] = useState<UserState>();
  const stateInitialized = useRef(false);

  useEffect(() => {
    if (!serverSentState || stateInitialized.current) return;
    setState(serverSentState);
    setMyLocation(serverSentState.x, serverSentState.y);
    setBikeMode(stateBoolean(serverSentState, UserStateKey.Bike));
    setVideoState(serverSentState?.state?.[UserStateKey.Video]);
    setAway(stateBoolean(serverSentState, UserStateKey.Away) === true);
    const heartbeat = parseInt(
      serverSentState?.state?.[UserStateKey.Heartbeat] || ""
    );
    if (heartbeat > 0) {
      setHeartbeat(heartbeat);
    }
    stateInitialized.current = true;
  }, [
    serverSentState,
    setMyLocation,
    setBikeMode,
    setVideoState,
    setAway,
    setHeartbeat,
  ]);

  const arrowMoveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    const buttonMove = throttle(() => {
      const moveIncrement = bike
        ? ARROW_MOVE_INCREMENT_PX_BIKE
        : ARROW_MOVE_INCREMENT_PX_WALK;
      setState((state) => {
        if (!state) return state;
        let needsUpdate = false;
        if (movingLeft && !movingRight) {
          state.x = Math.max(0, state.x - moveIncrement);
          needsUpdate = true;
        }
        if (movingRight && !movingLeft) {
          state.x = Math.min(
            PLAYA_WIDTH_AND_HEIGHT - 1,
            state.x + moveIncrement
          );
          needsUpdate = true;
        }
        if (movingUp && !movingDown) {
          state.y = Math.max(0, state.y - moveIncrement);
          needsUpdate = true;
        }
        if (movingDown && !movingUp) {
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
      });
    });
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
      const relayStateBike =
        state?.state?.[UserStateKey.Bike] === true.toString();
      const relayStateVideo = state?.state?.[UserStateKey.Video];
      const relayStateAway = state?.state?.[UserStateKey.Away];
      const relayStateHeartbeat = state?.state?.[UserStateKey.Heartbeat];
      const needsUpdate =
        bike !== relayStateBike ||
        videoState !== relayStateVideo ||
        away !== relayStateAway ||
        heartbeat !== relayStateHeartbeat;
      if (!needsUpdate) return state;

      if (!state.state) {
        state.state = {};
      }
      if (bike !== undefined) state.state[UserStateKey.Bike] = bike.toString();
      if (videoState !== undefined)
        state.state[UserStateKey.Video] = videoState;
      if (away !== undefined) state.state[UserStateKey.Away] = away.toString();
      if (heartbeat !== undefined)
        state.state[UserStateKey.Heartbeat] = heartbeat.toString();
      sendUpdatedState(state);
      return { ...state };
    });
  }, [bike, videoState, away, heartbeat, sendUpdatedState]);

  if (!profile || !state || !user || away) return <></>;

  const isVideoRoomOwnedByMe = profile.video?.inRoomOwnedBy === user.uid;

  return (
    <div
      className="avatar-container"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {isVideoRoomOwnedByMe && (
        <AvatarPartygoers state={state} user={{ id: user.uid, ...profile }} />
      )}
      <div
        className="avatar me"
        style={{
          top: state.y - PLAYA_AVATAR_SIZE / 2,
          left: state.x - PLAYA_AVATAR_SIZE / 2,
        }}
        ref={ref}
      >
        {!isVideoRoomOwnedByMe && (
          <div className={`avatar-name-container`}>{profile.partyName}</div>
        )}
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
          top: state.y - PLAYA_AVATAR_SIZE * 1.5,
          left: state.x - PLAYA_AVATAR_SIZE * 1.5,
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
