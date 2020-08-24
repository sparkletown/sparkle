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
} from "types/RelayMessage";
import { DEFAULT_WS_RELAY_URL } from "settings";
import { Avatar } from "./Avatar";
import { useSelector } from "hooks/useSelector";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import { WithId } from "utils/id";
import UserProfileModal from "components/organisms/UserProfileModal";
import { User } from "types/User";
import { MyAvatar } from "./MyAvatar";

interface PropsType {
  zoom: number;
  walkMode: boolean;
  setMyLocation(x: number, y: number): void;
}

const AvatarLayer: React.FunctionComponent<PropsType> = ({
  zoom,
  walkMode,
  setMyLocation,
}) => {
  useConnectPartyGoers();

  const { user } = useUser();
  const [userStateMap, setUserStateMap] = useState<UserStateMap>({});
  const [myServerSentState, setMyServerSentState] = useState<UserState>();
  const userStateMapRef = useRef(userStateMap);
  const wsRef = useRef<WebSocket>();
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);

  const sendUpdatedState = useMemo(
    () => (state: UserState) => {
      if (!user) return;
      setMyLocation(state.x, state.y);

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
        zoom={zoom}
        walkMode={walkMode}
        sendUpdatedState={sendUpdatedState}
        setMyLocation={setMyLocation}
      />
    ),
    [myServerSentState, zoom, walkMode, sendUpdatedState, setMyLocation]
  );

  return useMemo(
    () => (
      <>
        {myAvatar}
        {Object.keys(userStateMap)
          .sort()
          .filter(
            (uid) =>
              user?.uid !== uid &&
              !!partygoers.find((partygoer) => partygoer.id === uid)
          )
          .map((uid) => (
            <Avatar
              user={partygoers.find((partygoer) => partygoer.id === uid)}
              state={userStateMap[uid]}
              zoom={zoom}
              setSelectedUserProfile={setSelectedUserProfile}
              key={uid}
            />
          ))}
        <UserProfileModal
          show={selectedUserProfile !== undefined}
          onHide={() => setSelectedUserProfile(undefined)}
          userProfile={selectedUserProfile}
        />
      </>
    ),
    [myAvatar, partygoers, selectedUserProfile, user, userStateMap, zoom]
  );
};

export default AvatarLayer;
