import React, { useEffect, useState, useRef, useMemo } from "react";
import { WS_RELAY_URL } from "secrets";
import { useUser } from "hooks/useUser";
import {
  UserStateMap,
  HelloWsMessage,
  MessageType,
  BroadcastMessage,
  UserState,
  UpdateWsMessage,
  UserStateKey,
  stateBoolean,
  UserVideoState,
} from "types/RelayMessage";
import { DEFAULT_WS_RELAY_URL } from "settings";
import { Avatar } from "./Avatar";
import { useSelector } from "hooks/useSelector";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import { WithId } from "utils/id";
import { User } from "types/User";
import { MyAvatar } from "./MyAvatar";
import { Overlay } from "react-bootstrap";
import { MenuConfig } from "components/molecules/OverlayMenu/OverlayMenu";

interface PropsType {
  bikeMode: boolean;
  setMyLocation(x: number, y: number): void;
  setSelectedUserProfile: (user: WithId<User>) => void;
}

const AvatarLayer: React.FunctionComponent<PropsType> = ({
  bikeMode,
  setMyLocation,
  setSelectedUserProfile,
}) => {
  useConnectPartyGoers();

  const { user } = useUser();
  const [userStateMap, setUserStateMap] = useState<UserStateMap>({});
  const [videoState, setVideoState] = useState<string>();
  const [myServerSentState, setMyServerSentState] = useState<UserState>();
  const userStateMapRef = useRef(userStateMap);
  const wsRef = useRef<WebSocket>();
  const [hoveredUser, setHoveredUser] = useState<User | null>();
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef<HTMLDivElement>(null);

  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);

  const sendUpdatedState = useMemo(
    () => (state: UserState) => {
      if (!user) return;
      setMyLocation(state.x, state.y);
      setVideoState(state?.state?.[UserStateKey.Video]);

      if (wsRef.current) {
        const update: UpdateWsMessage = {
          type: MessageType.Update,
          uid: user.uid,
          update: state,
        };
        wsRef.current.send(JSON.stringify(update));
      } else {
        console.error("Warning: no ability to relay location");
      }
    },
    [user, setMyLocation]
  );

  useEffect(() => {
    if (!user) return;

    let unmounting = false;
    let ws: WebSocket;
    const newWebSocket = () => {
      const newWs = new WebSocket(WS_RELAY_URL || DEFAULT_WS_RELAY_URL);

      newWs.onopen = () => {
        const hello: HelloWsMessage = {
          type: MessageType.Hello,
          uid: user.uid,
        };
        newWs.send(JSON.stringify(hello));
        wsRef.current = newWs;
      };

      newWs.onclose = () => {
        if (!unmounting) {
          setTimeout(() => {
            ws = newWebSocket(); // @debt possible leak, consider a WeakRef
          }, 1000);
        }
      };

      newWs.onmessage = (data) => {
        try {
          const update = JSON.parse(data.data.toString()) as BroadcastMessage;
          let hasChanges = false;
          for (const uid of Object.keys(update.updates)) {
            if (uid === user.uid) {
              setMyServerSentState((myServerSentState) =>
                myServerSentState ? myServerSentState : update.updates[uid]
              );
              setVideoState(update.updates[uid].state?.[UserStateKey.Video]);
            } else {
              userStateMapRef.current[uid] = update.updates[uid];
              hasChanges = true;
            }
          }
          setUserStateMap((prev) =>
            hasChanges ? { ...userStateMapRef.current } : prev
          );
        } catch (err) {
          console.error(
            `Error ${err} receiving data from ws: ${data.data}; continuing`
          );
        }
      };

      return newWs;
    };

    ws = newWebSocket();
    return () => {
      unmounting = true;
      ws.close();
      setUserStateMap({});
    };
  }, [user]);

  const myAvatar = useMemo(
    () => (
      <MyAvatar
        serverSentState={myServerSentState}
        bike={bikeMode}
        videoState={videoState}
        sendUpdatedState={sendUpdatedState}
        setMyLocation={setMyLocation}
      />
    ),
    [myServerSentState, bikeMode, sendUpdatedState, setMyLocation, videoState]
  );

  const avatars = useMemo(
    () =>
      Object.keys(userStateMap)
        .sort()
        .filter(
          (uid) =>
            user?.uid !== uid &&
            !!partygoers.find((partygoer) => partygoer.id === uid)
        )
        .map((uid) => {
          const avatarUser = partygoers.find(
            (partygoer) => partygoer.id === uid
          );
          if (!avatarUser) return <></>;
          const videoState = userStateMap[uid].state?.[UserStateKey.Video];
          let menu: MenuConfig = {
            prompt: "test",
            choices: [
              {
                text: avatarUser?.partyName || "test1",
                onClick: () => alert(avatarUser?.partyName),
              },
            ],
          };
          if (videoState === UserVideoState.Open) {
            menu = {
              prompt: `Wanna join ${avatarUser?.partyName}'s video chat?`,
              choices: [
                { text: "Join chat", onClick: () => alert("yay") },
                {
                  text: "Message them first",
                  onClick: () => setSelectedUserProfile(avatarUser),
                },
              ],
            };
          }
          return (
            <Avatar
              user={avatarUser}
              x={userStateMap[uid].x}
              y={userStateMap[uid].y}
              videoState={videoState}
              bike={stateBoolean(userStateMap[uid], UserStateKey.Bike)}
              setHoveredUser={setHoveredUser}
              setHovered={setHovered}
              hoveredRef={hoveredRef}
              menu={menu}
              key={uid}
            />
          );
        }),
    [partygoers, user, userStateMap, setSelectedUserProfile]
  );

  return useMemo(
    () => (
      <>
        {myAvatar}
        {avatars}
        <Overlay target={hoveredRef.current} show={hovered}>
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            // @ts-expect-error
            <div {...props} style={{ ...props.style, padding: "10px" }}>
              <div className="playa-venue-text">
                <div className="playa-venue-maininfo">
                  <div className="playa-user-title">
                    {hoveredUser?.partyName}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Overlay>
      </>
    ),
    [myAvatar, avatars, hoveredUser, hovered]
  );
};

export default AvatarLayer;
