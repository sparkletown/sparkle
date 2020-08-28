import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { User, VideoState } from "types/User";
import { MyAvatar } from "./MyAvatar";
import { useFirebase } from "react-redux-firebase";
import { MenuConfig } from "./Playa";

interface PropsType {
  bikeMode: boolean | undefined;
  setBikeMode: (bikeMode: boolean | undefined) => void;
  videoState: string | undefined;
  setVideoState: (state: string | undefined) => void;
  setAvatarVisible: (visibility: boolean) => void;
  setMyLocation(x: number, y: number): void;
  setSelectedUserProfile: (user: WithId<User>) => void;
  setShowUserTooltip: (showUserTooltip: boolean) => void;
  setHoveredUser: (hoveredUser: User) => void;
  setShowMenu: (showMenu: boolean) => void;
  setMenu: (menu: MenuConfig) => void;
  userRef: React.MutableRefObject<HTMLDivElement | null>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
}

const AvatarLayer: React.FunctionComponent<PropsType> = ({
  bikeMode,
  setBikeMode,
  videoState,
  setVideoState,
  setAvatarVisible,
  setMyLocation,
  setSelectedUserProfile,
  setShowUserTooltip,
  setHoveredUser,
  setMenu,
  setShowMenu,
  userRef,
  menuRef,
}) => {
  useConnectPartyGoers();

  const { user } = useUser();
  const firebase = useFirebase();
  const [userStateMap, setUserStateMap] = useState<UserStateMap>({});
  const [myServerSentState, setMyServerSentState] = useState<UserState>();
  const userStateMapRef = useRef(userStateMap);
  const wsRef = useRef<WebSocket>();

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
          console.log("onmessage", update.updates);
          let hasChanges = false;
          for (const uid of Object.keys(update.updates)) {
            if (uid === user.uid) {
              const serverSentState = update.updates[uid];
              setMyServerSentState((myServerSentState) =>
                myServerSentState ? myServerSentState : serverSentState
              );
              setBikeMode(stateBoolean(serverSentState, UserStateKey.Bike));
              setVideoState(serverSentState?.state?.[UserStateKey.Video]);
              setAvatarVisible(
                stateBoolean(serverSentState, UserStateKey.Visible) !== false
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
  }, [user, setBikeMode, setVideoState, setAvatarVisible]);

  const selfUserProfile = user?.uid
    ? partygoers.find((pg) => pg.id === user.uid)
    : undefined;

  const myAvatar = useMemo(
    () =>
      selfUserProfile ? (
        <MyAvatar
          serverSentState={myServerSentState}
          bike={bikeMode}
          videoState={videoState}
          sendUpdatedState={sendUpdatedState}
          setMyLocation={setMyLocation}
          onClick={() => setSelectedUserProfile(selfUserProfile)}
          onMouseOver={(event: React.MouseEvent) => {
            setHoveredUser(selfUserProfile);
            userRef.current = event.target as HTMLDivElement;
            setShowUserTooltip(true);
          }}
          onMouseLeave={() => setShowUserTooltip(false)}
        />
      ) : undefined,
    [
      myServerSentState,
      bikeMode,
      videoState,
      sendUpdatedState,
      setMyLocation,
      selfUserProfile,
      setSelectedUserProfile,
      setHoveredUser,
      setShowUserTooltip,
      userRef,
    ]
  );

  const joinUserVideoChat = useCallback(
    (ownerUid: string) => {
      if (!user) return;
      const video: VideoState = {
        inRoomOwnedBy: ownerUid,
      };
      firebase.firestore().doc(`users/${user.uid}`).update({ video: video });
    },
    [firebase, user]
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
          const visible =
            stateBoolean(userStateMap[uid], UserStateKey.Visible) !== false;
          if (!visible) return <></>;
          const videoState = userStateMap[uid].state?.[UserStateKey.Video];
          const removedFromTheirChat =
            avatarUser.video?.removedParticipantUids &&
            avatarUser.video.removedParticipantUids.includes(avatarUser.id);
          const theirChatIsDisbanded =
            avatarUser.video?.removedParticipantUids &&
            avatarUser.video.myRoomIsDisbanded;
          const menu: MenuConfig =
            UserVideoState.Open &&
            !removedFromTheirChat &&
            !theirChatIsDisbanded
              ? {
                  prompt: `Wanna join ${avatarUser.partyName}'s video chat?`,
                  choices: [
                    {
                      text: "Join chat",
                      onClick: () => joinUserVideoChat(avatarUser.id),
                    },
                    {
                      text: "Message them first",
                      onClick: () => setSelectedUserProfile(avatarUser),
                    },
                  ],
                }
              : {
                  prompt:
                    avatarUser.partyName +
                    (videoState === UserVideoState.Locked
                      ? " (unavailable for video chat)"
                      : ""),
                  choices: [
                    {
                      text: "View profile & message them",
                      onClick: () => setSelectedUserProfile(avatarUser),
                    },
                  ],
                };
          return (
            <Avatar
              user={avatarUser}
              x={userStateMap[uid].x}
              y={userStateMap[uid].y}
              videoState={videoState}
              bike={stateBoolean(userStateMap[uid], UserStateKey.Bike) === true}
              onClick={(event: React.MouseEvent) => {
                setMenu(menu);
                menuRef.current = event.target as HTMLDivElement;
                setShowMenu(true);
              }}
              onMouseOver={(event: React.MouseEvent) => {
                setHoveredUser(avatarUser);
                userRef.current = event.target as HTMLDivElement;
                setShowUserTooltip(true);
              }}
              onMouseLeave={() => setShowUserTooltip(false)}
              key={uid}
            />
          );
        }),
    [
      partygoers,
      user,
      userStateMap,
      setSelectedUserProfile,
      joinUserVideoChat,
      setShowUserTooltip,
      setHoveredUser,
      userRef,
      setShowMenu,
      setMenu,
      menuRef,
    ]
  );

  return useMemo(
    () => (
      <>
        {myAvatar}
        {avatars}
      </>
    ),
    [myAvatar, avatars]
  );
};

export default AvatarLayer;
