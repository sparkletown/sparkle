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
import { MenuConfig, Shout } from "./Playa";

interface PropsType {
  bikeMode: boolean | undefined;
  setBikeMode: (bikeMode: boolean | undefined) => void;
  videoState: string | undefined;
  setVideoState: (state: string | undefined) => void;
  toggleVideoState: () => void;
  setAvatarVisible: (visibility: boolean) => void;
  movingUp: boolean;
  movingDown: boolean;
  movingLeft: boolean;
  movingRight: boolean;
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
  movingUp,
  movingDown,
  movingLeft,
  movingRight,
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
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [declinedInvites, setDeclinedInvites] = useState<string[]>([]);
  const [declinedAsks, setDeclinedAsks] = useState<string[]>([]);
  const [ackedRemoves, setAckedRemoves] = useState<string[]>([]);
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
    firebase
      .firestore()
      .collection(`experiences/playa/shouts`)
      .where("created_at", ">", new Date().getTime())
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const newShout = change.doc.data() as Shout;
            setShouts((prevShouts) => [...prevShouts, newShout]);
            setTimeout(() => {
              setShouts((prevShouts) => {
                return prevShouts.filter((r) => r !== newShout);
              });
            }, 15 * 1000);
          }
        });
      });
  }, [firebase, setShouts]);

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
        text:
          videoState === UserVideoState.Locked
            ? "Require consent for video chat"
            : "Disallow video chat requests",
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
  if (
    !selfUserProfile?.video?.inRoomOwnedBy ||
    selfUserProfile?.video?.inRoomOwnedBy !== selfUserProfile.id
  ) {
    menu.choices.push({
      text: "Start your own chat\n(you can invite others)",
      onClick: () => {
        if (selfUserProfile) {
          firebase
            .firestore()
            .doc(`users/${selfUserProfile.id}`)
            .update({
              video: { inRoomOwnedBy: selfUserProfile.id },
            });
        }
      },
    });
  }

  const myAvatar = useMemo(
    () =>
      selfUserProfile ? (
        <MyAvatar
          serverSentState={myServerSentState}
          bike={bikeMode}
          videoState={videoState}
          shouts={shouts.filter(
            (shout) => shout.created_by === selfUserProfile.id
          )}
          sendUpdatedState={sendUpdatedState}
          movingUp={movingUp}
          movingDown={movingDown}
          movingLeft={movingLeft}
          movingRight={movingRight}
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
      shouts,
      sendUpdatedState,
      setMyLocation,
      setBikeMode,
      setVideoState,
      setAvatarVisible,
      movingUp,
      movingDown,
      movingLeft,
      movingRight,
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

    const joinRoomOwnedBy = (uid: string) => {
      if (!user) return;
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({
          video: {
            ...profile?.video,
            removedParticipantUids: [],
            inRoomOwnedBy: uid,
          },
        });
    };

    const acceptRequestFrom = (uid: string) => {
      if (!user) return;
      if (!profile?.video || profile.video.acceptingRequestFromUid === uid) {
        return;
      }
      profile.video.acceptingRequestFromUid = uid;
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
    };

    const declineAsk = (uid: string) => {
      setDeclinedAsks((declined) => {
        if (declined?.includes(uid)) {
          return declined;
        }
        declined.push(uid);
        return [...declined];
      });
    };

    const declineInvite = (uid: string) => {
      setDeclinedInvites((declined) => {
        if (declined?.includes(uid)) {
          return declined;
        }
        declined.push(uid);
        return [...declined];
      });
    };

    const ackRemove = (uid: string) => {
      setAckedRemoves((acked) => {
        if (acked?.includes(uid)) {
          return acked;
        }
        acked.push(uid);
        return [...acked];
      });
    };

    const accepter = partygoers.find(
      (partygoer) =>
        profile?.video?.askingToJoinUid === partygoer.id &&
        partygoer.video?.acceptingRequestFromUid === user.uid &&
        partygoer.id !== user.uid
    );
    if (accepter?.id) {
      joinRoomOwnedBy(accepter.video?.inRoomOwnedBy ?? accepter.id);
    }

    // Menus to show
    // 1. Received invitation to join chat
    // 2. Someone asked to join your chat
    // 3. You were removed from the chat
    const inviter = partygoers.find(
      (partygoer) =>
        partygoer.video?.invitingUid === user.uid &&
        !declinedInvites.includes(partygoer.video?.invitingUid) &&
        partygoer.id !== user.uid
    );
    if (inviter?.id) {
      const menu = {
        prompt: `${inviter.partyName} invited you to join their chat`,
        choices: [
          {
            text: "Join them!",
            onClick: () =>
              joinRoomOwnedBy(inviter.video?.inRoomOwnedBy ?? inviter.id),
          },
          {
            text: "Refuse politely",
            onClick: () => declineInvite(inviter.id),
          },
        ],
        cancelable: false,
        onClose: () => declineInvite(inviter.id),
      };
      setMenu(menu);
      menuRef.current = myAvatarRef.current;
      setShowMenu(true);
    }

    // Show a menu if someone has asked to join our chat
    const asker = partygoers.find(
      (partygoer) =>
        partygoer.video?.askingToJoinUid === user.uid &&
        !declinedAsks.includes(partygoer.id) &&
        partygoer.id !== user.uid
    );
    if (asker) {
      const menu = {
        prompt: `${asker.partyName} would like to join your chat`,
        choices: [
          {
            text: "Accept",
            onClick: () => {
              acceptRequestFrom(asker.id);
              if (!profile?.video?.inRoomOwnedBy) {
                joinRoomOwnedBy(user.uid);
              }
              document.body.click();
            },
          },
          {
            text: "Refuse politely",
            onClick: () => declineAsk(asker.id),
          },
        ],
        cancelable: false,
        onClose: () => declineAsk(asker.id),
      };
      setMenu(menu);
      menuRef.current = myAvatarRef.current;
      setShowMenu(true);
    }

    // Inform if you were removed
    const remover = partygoers.find(
      (partygoer) =>
        partygoer?.video?.removedParticipantUids?.includes(user.uid) &&
        !ackedRemoves.includes(partygoer.id) &&
        partygoer.id !== user.uid
    );
    if (remover) {
      const menu = {
        prompt: `${remover.partyName} removed you from the chat.`,
        choices: [{ text: "OK", onClick: () => ackRemove(remover.id) }],
        cancelable: false,
        onHide: () => ackRemove(remover.id),
      };
      setMenu(menu);
      menuRef.current = myAvatarRef.current;
      setShowMenu(true);
    }
  }, [
    firebase,
    menuRef,
    partygoers,
    profile,
    setMenu,
    setShowMenu,
    user,
    videoState,
    ackedRemoves,
    declinedAsks,
    declinedInvites,
  ]);

  const avatars = useMemo(() => {
    if (!user) return;

    const askToJoin = (uid: string) => {
      if (!user || !profile) return;
      if (!profile.video) profile.video = {};
      profile.video.askingToJoinUid = uid;
      setDeclinedAsks((asks) => {
        if (asks?.includes(uid)) {
          asks.splice(asks.indexOf(uid), 1);
        }
        return asks;
      });
      if (profile.video.removedParticipantUids?.includes(uid)) {
        profile.video.removedParticipantUids.splice(
          profile.video.removedParticipantUids.indexOf(uid),
          1
        );
      }
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
    };

    const inviteToJoin = (uid: string) => {
      if (!user || !profile) return;
      if (!profile.video) profile.video = {};
      profile.video.invitingUid = uid;
      setDeclinedInvites((declines) => {
        if (declines?.includes(uid)) {
          declines.splice(declines.indexOf(uid), 1);
        }
        return declines;
      });
      if (profile.video.removedParticipantUids?.includes(uid)) {
        profile.video.removedParticipantUids.splice(
          profile.video.removedParticipantUids.indexOf(uid),
          1
        );
      }
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
    };

    const shoutsByUid = shouts.reduce<{ [key: string]: Shout[] }>(
      (map, shout) => {
        if (!map[shout.created_by]) {
          map[shout.created_by] = [];
        }
        map[shout.created_by].push(shout);
        return map;
      },
      {}
    );

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

        const viewProfileChoice = {
          text: "View profile & message them",
          onClick: () => setSelectedUserProfile(avatarUser),
        };
        const askToJoinThemChoice = (
          partyName: string | undefined,
          uid: string
        ) => ({
          text: `Ask to join them in ${partyName}'s chat`,
          onClick: () => askToJoin(uid),
        });
        const inviteThemToJoinYourChatChoice = {
          text: "Invite them to chat",
          onClick: () => inviteToJoin(uid),
        };

        const meIsMarkedAsInAChat = profile?.video?.inRoomOwnedBy !== undefined;
        const theyAreMarkedAsInAChat =
          avatarUser.video?.inRoomOwnedBy !== undefined;
        const theyAreHostOfTheirChat =
          avatarUser.video?.inRoomOwnedBy === avatarUser.id;
        const theirChatHostUser = theyAreHostOfTheirChat
          ? avatarUser
          : partygoers.find(
              (partygoer) => partygoer.id === avatarUser.video?.inRoomOwnedBy
            );
        const theyAreInAChat =
          theyAreMarkedAsInAChat && theirChatHostUser !== undefined;
        const meIsRemovedFromTheirHostsChat =
          theirChatHostUser?.video?.removedParticipantUids &&
          theirChatHostUser?.video.removedParticipantUids.includes(
            avatarUser.id
          );
        const meIsInAChat =
          meIsMarkedAsInAChat && !meIsRemovedFromTheirHostsChat;
        const theyAreInAChatWithMe =
          meIsInAChat &&
          theyAreInAChat &&
          profile?.video?.inRoomOwnedBy === avatarUser.video?.inRoomOwnedBy;
        const theirHostsChatIsLocked =
          theirChatHostUser !== undefined && // TypeScript checker requires repeating this
          userStateMap[theirChatHostUser.id]?.state?.[UserStateKey.Video] ===
            UserVideoState.Locked;
        const theirChatIsLocked =
          userStateMap[avatarUser.id]?.state?.[UserStateKey.Video] ===
          UserVideoState.Locked;

        const generateMenu: () => MenuConfig = () => {
          if (theirChatIsLocked) {
            return {
              prompt: `${avatarUser.partyName}: not allowing video chat`,
              choices: [viewProfileChoice],
              cancelable: true,
            };
          }
          if (meIsInAChat && theyAreInAChat && theyAreInAChatWithMe) {
            return {
              prompt: `${avatarUser.partyName}: currently chatting with this person`,
              choices: [viewProfileChoice],
              cancelable: true,
            };
          }
          if (theyAreInAChat) {
            if (theirHostsChatIsLocked) {
              return {
                prompt: `${avatarUser.partyName}: in a locked chat hosted by ${
                  theyAreHostOfTheirChat ? "them" : theirChatHostUser?.partyName
                }`,
                choices: [viewProfileChoice],
                cancelable: true,
              };
            } else {
              return {
                prompt: `${avatarUser.partyName}: in an open chat hosted by ${
                  theyAreHostOfTheirChat ? "them" : theirChatHostUser?.partyName
                }`,
                choices: [
                  viewProfileChoice,
                  askToJoinThemChoice(avatarUser.partyName, avatarUser.id),
                ],
                cancelable: true,
              };
            }
          }
          return {
            prompt: `${avatarUser.partyName}: open to chat`,
            choices: [viewProfileChoice, inviteThemToJoinYourChatChoice],
            cancelable: true,
          };
        };

        return (
          <Avatar
            user={avatarUser}
            x={userStateMap[uid].x}
            y={userStateMap[uid].y}
            videoState={videoState}
            bike={stateBoolean(userStateMap[uid], UserStateKey.Bike) === true}
            shouts={shoutsByUid[uid]}
            onClick={(event: React.MouseEvent) => {
              setMenu(generateMenu());
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
    shouts,
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
