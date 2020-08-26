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
} from "types/RelayMessage";
import { DEFAULT_WS_RELAY_URL } from "settings";
import { Avatar } from "./Avatar";
import { useSelector } from "hooks/useSelector";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import { WithId } from "utils/id";
import UserProfileModal from "components/organisms/UserProfileModal";
import { User } from "types/User";
import { MyAvatar } from "./MyAvatar";
import { Overlay } from "react-bootstrap";

interface PropsType {
  bikeMode: boolean;
  setMyLocation(x: number, y: number): void;
}

const AvatarLayer: React.FunctionComponent<PropsType> = ({
  bikeMode,
  setMyLocation,
}) => {
  useConnectPartyGoers();

  const { user } = useUser();
  const [userStateMap, setUserStateMap] = useState<UserStateMap>({});
  const [videoState, setVideoState] = useState<string>();
  const [myServerSentState, setMyServerSentState] = useState<UserState>();
  const userStateMapRef = useRef(userStateMap);
  const wsRef = useRef<WebSocket>();
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
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
        bikeMode={bikeMode}
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
          return (
            <Avatar
              user={avatarUser}
              state={userStateMap[uid]}
              setSelectedUserProfile={setSelectedUserProfile}
              setHoveredUser={setHoveredUser}
              setHovered={setHovered}
              hoveredRef={hoveredRef}
              key={uid}
            />
          );
        }),
    [partygoers, user, userStateMap]
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
        <UserProfileModal
          show={selectedUserProfile !== undefined}
          onHide={() => setSelectedUserProfile(undefined)}
          userProfile={selectedUserProfile}
        />
      </>
    ),
    [myAvatar, avatars, hoveredUser, selectedUserProfile, hovered]
  );
};

export default AvatarLayer;
