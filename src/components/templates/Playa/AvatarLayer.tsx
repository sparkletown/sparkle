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
import MyAvatar from "./MyAvatar";
import { useFirebase } from "react-redux-firebase";
import { MenuConfig } from "./Playa";

interface PropsType {
  bikeMode: boolean | undefined;
  setBikeMode: (bikeMode: boolean | undefined) => void;
  videoState: string | undefined;
  setVideoState: (state: string | undefined) => void;
  toggleVideoState: () => void;
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
  toggleVideoState,
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

  const { user, profile } = useUser();
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
              setMyServerSentState(serverSentState);
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
  }, [user, setBikeMode, setVideoState, setAvatarVisible, sendUpdatedState]);

  const selfUserProfile = user?.uid
    ? partygoers.find((pg) => pg.id === user.uid)
    : undefined;

  const menu = {
    prompt: `${selfUserProfile?.partyName} (you) - available actions:`,
    choices: [
      {
        text: `${
          videoState === UserVideoState.Open ? "Deny" : "Allow"
        } video chat requets`,
        onClick: () => toggleVideoState(),
      },
      {
        text: "View Profile",
        onClick: () => {
          if (selfUserProfile) setSelectedUserProfile(selfUserProfile);
        },
      },
    ],
    cancelable: true,
  };

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
          onClick={(event: React.MouseEvent) => {
            setMenu(menu);
            menuRef.current = event.target as HTMLDivElement;
            setShowMenu(true);
          }}
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
      setHoveredUser,
      setShowUserTooltip,
      userRef,
      menu,
      menuRef,
      setMenu,
      setShowMenu,
    ]
  );

  useEffect(() => {
    if (!user) return;

    const declineJoinRequest = (uid: string) => {
      if (!user) return;
      if (
        !profile?.video ||
        (profile.video.decliningRequestsFromUids &&
          profile.video.decliningRequestsFromUids.includes(uid))
      ) {
        return;
      }
      if (!profile.video.decliningRequestsFromUids) {
        profile.video.decliningRequestsFromUids = [];
      }
      profile.video.decliningRequestsFromUids.push(uid);
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
    };

    const joinUserVideoChat = (uid: string) => {
      if (!user) return;
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: { inRoomOwnedBy: uid } });
    };

    const acceptJoinRequest = (fromUid: string) => {
      if (!user) return;
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({
          video: {
            acceptingRequestFromUid: fromUid,
            inRoomOwnedBy: user.uid,
          },
        });
    };

    const ackDecline = (uid: string) => {
      if (!user) return;
      if (
        !profile?.video ||
        (profile.video.ackedDeclinesFromUids &&
          profile.video.ackedDeclinesFromUids.includes(uid))
      ) {
        return;
      }
      if (!profile.video.ackedDeclinesFromUids) {
        profile.video.ackedDeclinesFromUids = [];
      }
      profile.video.ackedDeclinesFromUids.push(uid);
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
    };

    // Only accept a request we were already asking
    const accepter = partygoers.find(
      (partygoer) =>
        profile?.video?.requestingToJoinUid === partygoer.id &&
        partygoer.video?.acceptingRequestFromUid === user.uid
    );
    if (accepter?.id) {
      joinUserVideoChat(accepter.id);
    }

    // Show a menu if someone has asked to join our chat
    const asker = partygoers.find(
      (partygoer) => partygoer.video?.requestingToJoinUid === user.uid
    );
    if (asker) {
      if (videoState === UserVideoState.Locked) {
        declineJoinRequest(asker.id);
      } else {
        const menu = {
          prompt: `${asker.partyName} would like to join your chat`,
          choices: [
            { text: "Accept", onClick: () => acceptJoinRequest(asker.id) },
            {
              text: "Refuse politely",
              onClick: () => declineJoinRequest(asker.id),
            },
          ],
          cancelable: false,
          onClose: () => declineJoinRequest(asker.id),
        };
        setMenu(menu);
        menuRef.current = myAvatarRef.current;
        setShowMenu(true);
      }
    }

    // Inform if there was a decline
    const decliner = partygoers.find(
      (partygoer) =>
        profile?.video?.requestingToJoinUid === partygoer.id &&
        partygoer.video?.decliningRequestsFromUids &&
        partygoer.video.decliningRequestsFromUids.includes(user.uid) &&
        (!profile?.video?.ackedDeclinesFromUids ||
          !profile.video.ackedDeclinesFromUids.includes(partygoer.id))
    );
    if (decliner) {
      const menu = {
        prompt: `${decliner.partyName} politely refused your request to video chat.\n\nYou can still message them!`,
        choices: [{ text: "OK", onClick: () => ackDecline(decliner.id) }],
        cancelable: false,
        onHide: () => ackDecline(decliner.id),
      };
      setMenu(menu);
      menuRef.current = myAvatarRef.current;
      setShowMenu(true);
    }
  }, [
    firebase,
    partygoers,
    profile,
    setMenu,
    menuRef,
    setShowMenu,
    user,
    videoState,
  ]);

  const avatars = useMemo(() => {
    const askToJoin = (uid: string) => {
      if (!user || !profile?.video) return;
      profile.video.requestingToJoinUid = uid;
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
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
          videoState === UserVideoState.Open && !removedFromTheirChat
            ? {
                prompt: `Wanna join ${avatarUser.partyName}'s video chat?`,
                choices: [
                  {
                    text: `Ask to join ${avatarUser.partyName}`,
                    onClick: () => askToJoin(avatarUser.id),
                  },
                  {
                    text: "Message them instead",
                    onClick: () => setSelectedUserProfile(avatarUser),
                  },
                ],
                cancelable: false,
              }
            : {
                prompt:
                  avatarUser.partyName +
                  (videoState !== UserVideoState.Open
                    ? "\n\n(Closed to video chat)"
                    : ""),
                choices: [
                  {
                    text: "View profile & message them",
                    onClick: () => setSelectedUserProfile(avatarUser),
                  },
                ],
                cancelable: true,
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
    profile,
    userStateMap,
    setSelectedUserProfile,
    setShowUserTooltip,
    setHoveredUser,
    userRef,
    menuRef,
    setShowMenu,
    setMenu,
    firebase,
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
