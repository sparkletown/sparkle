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
          videoState === UserVideoState.Open ? "Require consent for" : "Allow"
        } video chat`,
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

    const joinUserVideoChat = (uid: string) => {
      if (!user) return;
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: { inRoomOwnedBy: uid } });
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

    const declineRequestFrom = (uid: string) => {
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

    const ackRemove = (uid: string) => {
      if (!user) return;
      if (
        !profile?.video ||
        (profile.video.ackedRemovesFromUids &&
          profile.video.ackedRemovesFromUids.includes(uid))
      ) {
        return;
      }
      if (!profile.video.ackedRemovesFromUids) {
        profile.video.ackedRemovesFromUids = [];
      }
      profile.video.ackedRemovesFromUids.push(uid);
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
    };

    const accepter = partygoers.find(
      (partygoer) =>
        profile?.video?.askingToJoinUid === partygoer.id &&
        partygoer.video?.acceptingRequestFromUid === user.uid
    );
    if (accepter?.id) {
      joinUserVideoChat(accepter.id);
    }

    // Menus to show
    // 1. Received invitation to join chat
    // 2. Someone asked to join your chat
    // 3. You got refused politely
    // 4. You were removed from the chat
    const inviter = partygoers.find(
      (partygoer) => partygoer.video?.invitingUid === user.uid
    );
    if (inviter?.id) {
      const menu = {
        prompt: `${inviter.partyName} invited you to join their chat`,
        choices: [
          {
            text: "Join them!",
            onClick: () =>
              joinUserVideoChat(inviter.video?.inRoomOwnedBy ?? inviter.id),
          },
          {
            text: "Refuse politely",
            onClick: () => declineRequestFrom(inviter.id),
          },
        ],
        cancelable: false,
        onClose: () => declineRequestFrom(inviter.id),
      };
      setMenu(menu);
      menuRef.current = myAvatarRef.current;
      setShowMenu(true);
    }

    // Show a menu if someone has asked to join our chat
    const asker = partygoers.find(
      (partygoer) => partygoer.video?.askingToJoinUid === user.uid
    );
    if (asker) {
      if (videoState === UserVideoState.Open) {
        console.log("got ask from ", asker.id, "accepting");
        acceptRequestFrom(asker.id);
        joinUserVideoChat(user.uid);
      } else {
        const menu = {
          prompt: `${asker.partyName} would like to join your chat`,
          choices: [
            {
              text: "Accept",
              onClick: () => acceptRequestFrom(asker.id),
            },
            {
              text: "Refuse politely",
              onClick: () => declineRequestFrom(asker.id),
            },
          ],
          cancelable: false,
          onClose: () => declineRequestFrom(asker.id),
        };
        setMenu(menu);
        menuRef.current = myAvatarRef.current;
        setShowMenu(true);
      }
    }

    // Inform if there was a decline
    const decliner = partygoers.find(
      (partygoer) =>
        partygoer?.video?.decliningRequestsFromUids?.includes(user.uid) &&
        (!profile?.video?.ackedDeclinesFromUids ||
          !profile.video.ackedDeclinesFromUids.includes(partygoer.id))
    );
    if (decliner) {
      const menu = {
        prompt: `${decliner.partyName} politely refused your request.\n\nYou can still message them!`,
        choices: [
          {
            text: "OK",
            onClick: () => ackDecline(decliner.id),
          },
        ],
        cancelable: false,
        onHide: () => ackDecline(decliner.id),
      };
      setMenu(menu);
      menuRef.current = myAvatarRef.current;
      setShowMenu(true);
    }

    // Inform if you were removed
    const remover = partygoers.find(
      (partygoer) =>
        partygoer?.video?.removedParticipantUids?.includes(user.uid) &&
        (!profile?.video?.ackedRemovesFromUids ||
          !profile.video.ackedRemovesFromUids.includes(partygoer.id))
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
  ]);

  const avatars = useMemo(() => {
    if (!user) return;

    const askToJoin = (uid: string) => {
      if (!user || !profile?.video) return;
      profile.video.askingToJoinUid = uid;
      if (profile.video.decliningRequestsFromUids?.includes(uid)) {
        profile.video.decliningRequestsFromUids.splice(
          profile.video.decliningRequestsFromUids.indexOf(uid),
          1
        );
      }
      if (profile.video.removedParticipantUids?.includes(uid)) {
        profile.video.removedParticipantUids.splice(
          profile.video.removedParticipantUids.indexOf(uid),
          1
        );
      }
      console.log("askToJoin", profile.video);
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: profile.video });
    };

    const inviteToJoin = (uid: string) => {
      if (!user || !profile?.video) return;
      profile.video.invitingUid = uid;
      if (profile.video.decliningRequestsFromUids?.includes(uid)) {
        profile.video.decliningRequestsFromUids.splice(
          profile.video.decliningRequestsFromUids.indexOf(uid),
          1
        );
      }
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

    const joinRoomOwnedBy = (uid: string) => {
      if (!user || !profile?.video) return;
      firebase
        .firestore()
        .doc(`users/${user.uid}`)
        .update({ video: { inRoomOwnedBy: uid } });
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

        const viewProfileChoice = {
          text: "View profile & message them",
          onClick: () => setSelectedUserProfile(avatarUser),
        };
        const askToJoinThemChoice = (
          partyName: string | undefined,
          uid: string
        ) => ({
          text: `Ask ${partyName} to join`,
          onClick: () => askToJoin(uid),
        });
        const inviteThemToJoinYourChatChoice = {
          text: "Invite them to join your chat",
          onClick: () => inviteToJoin(uid),
        };
        const joinInstantlyChoice = (uid: string) => ({
          text: "Join them!",
          onClick: () => joinRoomOwnedBy(uid),
        });

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
        const theirChatIsLocked =
          theyAreInAChat &&
          theirChatHostUser !== undefined && // TypeScript checker requires repeating this
          userStateMap[theirChatHostUser.id]?.state?.[UserStateKey.Video] ===
            UserVideoState.Locked;
        const theirChatIsOpen =
          userStateMap[avatarUser.id]?.state?.[UserStateKey.Video] !==
          UserVideoState.Locked;

        const askToJoinTheirChatMenus: () => MenuConfig = () => {
          let menu: MenuConfig;
          if (theyAreHostOfTheirChat) {
            if (theirChatIsLocked) {
              menu = {
                prompt: `${avatarUser.partyName}: in a locked chat`,
                choices: [
                  askToJoinThemChoice(avatarUser.partyName, avatarUser.id),
                ],
                cancelable: true,
              };
              if (meIsInAChat) {
                menu?.choices?.push(inviteThemToJoinYourChatChoice);
              }
            } else {
              menu = {
                prompt: `${avatarUser.partyName}: open to chat!`,
                choices: [joinInstantlyChoice(avatarUser.id)],
                cancelable: true,
              };
              if (meIsInAChat) {
                menu?.choices?.push(inviteThemToJoinYourChatChoice);
              }
            }
          } else {
            if (theirChatIsLocked) {
              menu = {
                prompt: `${avatarUser.partyName}: in a locked chat owned by ${theirChatHostUser?.partyName}`,
                choices: [
                  askToJoinThemChoice(
                    theirChatHostUser?.partyName,
                    theirChatHostUser?.id || ""
                  ),
                ],
                cancelable: true,
              };
              if (meIsInAChat) {
                menu?.choices?.push(inviteThemToJoinYourChatChoice);
              }
            } else {
              menu = {
                prompt: `${avatarUser.partyName}: ready to chat!`,
                choices: [joinInstantlyChoice(avatarUser.id)],
                cancelable: true,
              };
            }
          }
          return menu;
        };

        const generateMenu: () => MenuConfig = () => {
          if (meIsInAChat) {
            if (theyAreInAChat) {
              if (theyAreInAChatWithMe) {
                return {
                  prompt: `${avatarUser.partyName}: currently chatting with this person`,
                  choices: [viewProfileChoice],
                  cancelable: true,
                };
              } else {
                return askToJoinTheirChatMenus();
              }
            }
          } else if (theyAreInAChat) {
            return askToJoinTheirChatMenus();
          } else if (theirChatIsOpen) {
            return {
              prompt: `${avatarUser.partyName}: open to chat!`,
              choices: [
                {
                  text: "Join them!",
                  onClick: () => askToJoin(avatarUser.id),
                },
              ],
              cancelable: true,
            };
          }
          return {
            prompt: `${avatarUser.partyName}: available actions`,
            choices: [inviteThemToJoinYourChatChoice],
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
