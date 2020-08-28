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
  const myAvatarRef = useRef<HTMLDivElement>(null);

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
              const serverSentState = update.updates[uid];
              setMyServerSentState((myServerSentState) =>
                myServerSentState ? myServerSentState : serverSentState
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
          setBikeMode={setBikeMode}
          setVideoState={setVideoState}
          setAvatarVisible={setAvatarVisible}
          onClick={() => setSelectedUserProfile(selfUserProfile)}
          onMouseOver={(event: React.MouseEvent) => {
            setHoveredUser(selfUserProfile);
            userRef.current = event.target as HTMLDivElement;
            setShowUserTooltip(true);
          }}
          onMouseLeave={() => setShowUserTooltip(false)}
          ref={myAvatarRef}
        />
      ) : undefined,
    [
      myServerSentState,
      bikeMode,
      videoState,
      sendUpdatedState,
      setMyLocation,
      setBikeMode,
      setVideoState,
      setAvatarVisible,
      selfUserProfile,
      setSelectedUserProfile,
      setHoveredUser,
      setShowUserTooltip,
      userRef,
    ]
  );

  const cancelJoinRequests = useCallback(() => {
    if (
      myServerSentState?.state &&
      UserStateKey.VideoAskingToJoin in myServerSentState.state
    ) {
      delete myServerSentState.state[UserStateKey.VideoAskingToJoin];
      sendUpdatedState(myServerSentState);
    }
  }, [myServerSentState, sendUpdatedState]);

  // If video is locked, auto-decline
  // Otherwise ask with a menu
  useEffect(() => {
    if (!user) return;

    const declineJoinRequest = (uid: string) => {
      if (!myServerSentState) return;
      if (!myServerSentState.state) {
        myServerSentState.state = {};
      }
      let decliningUids = myServerSentState.state[UserStateKey.VideoDeclining];
      if (!decliningUids) {
        decliningUids = uid;
      } else {
        decliningUids += "," + uid;
      }
      myServerSentState.state[UserStateKey.VideoDeclining] = decliningUids;
      sendUpdatedState(myServerSentState);
    };

    const joinUserVideoChat = (ownerUid: string) => {
      if (!user) return;
      const video: VideoState = {
        inRoomOwnedBy: ownerUid,
      };
      firebase.firestore().doc(`users/${user.uid}`).update({ video: video });
    };

    const acceptJoinRequest = (uid: string) => {
      if (!myServerSentState) return;
      if (!myServerSentState.state) {
        myServerSentState.state = {};
      }
      myServerSentState.state[UserStateKey.VideoAccepting] = uid;
      // Also delete any asks, since now we will join a chat
      if (myServerSentState.state[UserStateKey.VideoAskingToJoin]) {
        delete myServerSentState.state[UserStateKey.VideoAskingToJoin];
      }
      sendUpdatedState(myServerSentState);
      joinUserVideoChat(uid);
    };

    const refuserUid = Object.keys(userStateMap).find(
      (uid) =>
        userStateMap[uid].state?.[UserStateKey.VideoDeclining] !== undefined &&
        userStateMap[uid].state?.[UserStateKey.VideoDeclining]
          .split(",")
          .includes(uid)
    );
    if (refuserUid !== undefined) {
      const refuser = partygoers.find(
        (partygoer) => partygoer.id === refuserUid
      );
      if (refuser) {
        const menu = {
          prompt: `${refuser.partyName} politely refused your offer to chat.`,
          choices: [{ text: "OK" }],
          onHide: () => cancelJoinRequests(),
        };
        setMenu(menu);
        menuRef.current = myAvatarRef.current;
        setShowMenu(true);
      }
    }

    const askerUid = Object.keys(userStateMap).find(
      (uid) =>
        userStateMap[uid].state?.[UserStateKey.VideoAskingToJoin] === user?.uid
    );
    if (askerUid !== undefined) {
      const asker = partygoers.find((partygoer) => partygoer.id === askerUid);
      if (asker) {
        if (videoState === UserVideoState.Locked) {
          declineJoinRequest(askerUid);
          return;
        }

        const menu = {
          prompt: `${asker.partyName} would like to join your chat`,
          choices: [
            { text: "Accept", onClick: () => acceptJoinRequest(askerUid) },
            {
              text: "Refuse politely",
              onClick: () => declineJoinRequest(askerUid),
            },
          ],
          onClose: () => declineJoinRequest(askerUid),
        };
        setMenu(menu);
        menuRef.current = myAvatarRef.current;
        setShowMenu(true);
      }
    }
  });

  const avatars = useMemo(() => {
    const askToJoin = (uid: string) => {
      if (!myServerSentState) return;
      if (!myServerSentState.state) {
        myServerSentState.state = {};
      }
      myServerSentState.state[UserStateKey.VideoAskingToJoin] = uid;
      sendUpdatedState(myServerSentState);
    };

    return Object.keys(userStateMap)
      .sort()
      .filter(
        (uid) =>
          user?.uid !== uid &&
          !!partygoers.find((partygoer) => partygoer.id === uid)
      )
      .map((uid) => {
        const avatarUser = partygoers.find((partygoer) => partygoer.id === uid);
        if (!avatarUser) return <></>;
        const visible =
          stateBoolean(userStateMap[uid], UserStateKey.Visible) !== false;
        if (!visible) return <></>;
        const videoState = userStateMap[uid].state?.[UserStateKey.Video];
        const removedFromTheirChat =
          avatarUser.video?.removedParticipantUids &&
          avatarUser.video.removedParticipantUids.includes(avatarUser.id);
        const menu: MenuConfig =
          UserVideoState.Open && !removedFromTheirChat
            ? {
                prompt: `Wanna join ${avatarUser.partyName}'s video chat?`,
                choices: [
                  {
                    text: `Ask ${avatarUser.partyName} to join`,
                    onClick: () => askToJoin(avatarUser.id),
                  },
                  {
                    text: "Message them first",
                    onClick: () => setSelectedUserProfile(avatarUser),
                  },
                ],
                onHide: () => cancelJoinRequests(),
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
      });
  }, [
    partygoers,
    user,
    userStateMap,
    setSelectedUserProfile,
    setShowUserTooltip,
    setHoveredUser,
    userRef,
    setShowMenu,
    setMenu,
    menuRef,
    myServerSentState,
    sendUpdatedState,
    cancelJoinRequests,
  ]);

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
