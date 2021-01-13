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
import {
  DEFAULT_WS_RELAY_URL,
  ENABLE_PLAYA_ADDRESS,
  PLAYA_VENUE_NAME,
} from "settings";
import { Avatar } from "./Avatar";
import { useSelector } from "hooks/useSelector";
import { usePartygoers } from "hooks/users";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { WithId } from "utils/id";
import { User } from "types/User";
import MyAvatar from "./MyAvatar";
import { useFirebase } from "react-redux-firebase";
import { MenuConfig, Shout } from "./Playa";
import Switch from "react-switch";
import "./AvatarLayer.scss";
import {
  ChatRequest,
  ChatRequestState,
  ChatRequestType,
} from "types/ChatRequest";
import { useDispatch } from "hooks/useDispatch";
import { UPDATE_LOCATION } from "store/actions/Location";
import { playaAddress } from "utils/address";

interface PropsType {
  useProfilePicture: boolean;
  bikeMode: boolean | undefined;
  setBikeMode: (bikeMode: boolean | undefined) => void;
  videoState: string | undefined;
  setVideoState: (state: string | undefined) => void;
  toggleVideoState: () => void;
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
  useProfilePicture,
  bikeMode,
  setBikeMode,
  videoState,
  setVideoState,
  toggleVideoState,
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
  const { user, profile } = useUser();
  const firebase = useFirebase();
  const [userStateMap, setUserStateMap] = useState<UserStateMap>({});
  const [myServerSentState, setMyServerSentState] = useState<UserState>();
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [ackedRemoves, setAckedRemoves] = useState<string[]>([]);
  const userStateMapRef = useRef(userStateMap);
  const wsRef = useRef<WebSocket>();
  const myAvatarRef = useRef<HTMLDivElement>(null);

  const partygoers = usePartygoers();

  const dispatch = useDispatch();
  const sendUpdatedState = useMemo(
    () => (state: UserState) => {
      if (!user) return;
      setMyLocation(state.x, state.y);
      dispatch({ type: UPDATE_LOCATION, x: state.x, y: state.y });

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
    [user, setMyLocation, dispatch]
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

  const wsInitedRef = useRef(false);
  useEffect(() => {
    if (!user || wsInitedRef.current) return;

    const unmounting = false;
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
            newWebSocket(); // @debt possible leak, consider a WeakRef
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
    };
    newWebSocket();
    wsInitedRef.current = true;
  }, [user, setBikeMode, setVideoState, sendUpdatedState]);

  const selfUserProfile = user?.uid
    ? partygoers.find((pg) => pg.id === user.uid)
    : undefined;

  const menu: MenuConfig = {
    prompt: "This is your avatar",
    choices: [
      {
        text: "My Profile",
        onClick: () => {
          if (selfUserProfile) setSelectedUserProfile(selfUserProfile);
        },
      },
      {
        text: (
          <div className="video-chat-text-row">
            <Switch
              height={20}
              width={40}
              checkedIcon={false}
              uncheckedIcon={false}
              onChange={() => {}}
              checked={videoState !== UserVideoState.Locked}
            />
            <div className="video-chat-text">
              {videoState === UserVideoState.Locked ? "closed" : "open"} to
              video chat
            </div>
          </div>
        ),
        onClick: () => toggleVideoState(),
      },
    ],
  };
  if (
    !selfUserProfile?.video?.inRoomOwnedBy ||
    selfUserProfile?.video?.inRoomOwnedBy !== selfUserProfile.id
  ) {
    menu.choices &&
      menu.choices.unshift({
        text: "Start a group video chat",
        onClick: () => {
          if (videoState === UserVideoState.Locked) {
            toggleVideoState();
          }
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
  } else {
    menu.choices &&
      menu.choices.unshift({
        text: "Stop the group video chat",
        onClick: () => {
          if (selfUserProfile) {
            firebase
              .firestore()
              .doc(`users/${selfUserProfile.id}`)
              .update({ video: {} });
          }
        },
      });
  }

  const myAvatar = useMemo(
    () =>
      selfUserProfile ? (
        <MyAvatar
          useProfilePicture={useProfilePicture}
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
      selfUserProfile,
      useProfilePicture,
      myServerSentState,
      bikeMode,
      videoState,
      shouts,
      sendUpdatedState,
      movingUp,
      movingDown,
      movingLeft,
      movingRight,
      setMyLocation,
      setBikeMode,
      setVideoState,
      setMenu,
      menu,
      menuRef,
      setShowMenu,
      setHoveredUser,
      userRef,
      setShowUserTooltip,
    ]
  );

  useFirestoreConnect([
    {
      collection: "experiences",
      doc: PLAYA_VENUE_NAME,
      subcollections: [{ collection: "chatRequests" }],
      storeAs: "chatRequests",
      orderBy: ["createdAt", "asc"],
    },
  ]);
  const chatRequests = useSelector(
    (state) => state.firestore.ordered.chatRequests
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
            removedParticipantUids: [],
            inRoomOwnedBy: uid,
          },
        });
    };

    const setChatRequestState = (id: string, state: ChatRequestState) => {
      firebase
        .firestore()
        .doc(`experiences/playa/chatRequests/${id}`)
        .update({ state });
    };

    const setChatRequestFromJoined = (id: string) => {
      firebase
        .firestore()
        .doc(`experiences/playa/chatRequests/${id}`)
        .update({ fromJoined: true });
    };

    const setChatRequestToJoined = (id: string) => {
      firebase
        .firestore()
        .doc(`experiences/playa/chatRequests/${id}`)
        .update({ toJoined: true });
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

    const cancelPendingChatRequestsExcept = (id: string) => {
      chatRequests
        ?.filter(
          (r) =>
            r.id !== id &&
            (r.state === ChatRequestState.Asked ||
              r.state === ChatRequestState.Accepted) &&
            (r.fromUid === user.uid || r.toUid === user.uid)
        )
        .map((r) => setChatRequestState(r.id, ChatRequestState.Canceled));
    };

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
        onHide: () => ackRemove(remover.id),
      };
      setMenu(menu);
      menuRef.current = myAvatarRef.current;
      setShowMenu(true);
      return;
    }

    // Show any requests in progress
    const actionableRequests = chatRequests?.filter(
      (r) =>
        r.state !== ChatRequestState.Completed &&
        ((r.state === ChatRequestState.Asked && r.toUid === user.uid) ||
          (r.state === ChatRequestState.Declined && r.fromUid === user.uid) ||
          (r.state === ChatRequestState.Accepted &&
            (r.fromUid === user.uid || r.toUid === user.uid)))
    );
    if (actionableRequests && actionableRequests.length > 0) {
      const chatRequest = actionableRequests[0];

      const fromUser = partygoers.find(
        (partygoer) => partygoer.id === chatRequest.fromUid
      );
      const toUser = partygoers.find(
        (partygoer) => partygoer.id === chatRequest.toUid
      );
      if (!fromUser || !toUser) return;

      if (
        (chatRequest.state !== ChatRequestState.Asked &&
          chatRequest.state !== ChatRequestState.Accepted &&
          chatRequest.state !== ChatRequestState.Declined) ||
        (chatRequest.type !== ChatRequestType.JoinMyChat &&
          chatRequest.type !== ChatRequestType.JoinTheirChat)
      ) {
        return;
      }

      switch (chatRequest.state) {
        case ChatRequestState.Asked:
          let accepted = false;
          setMenu({
            prompt: `${fromUser.partyName} ${
              chatRequest.type === ChatRequestType.JoinTheirChat
                ? "invited you to join their chat"
                : "asked to join your chat"
            }`,
            choices: [
              {
                text:
                  chatRequest.type === ChatRequestType.JoinTheirChat
                    ? "Join them!"
                    : "Let them in!",
                onClick: () => {
                  accepted = true;
                  cancelPendingChatRequestsExcept(chatRequest.id);
                  setChatRequestState(
                    chatRequest.id,
                    ChatRequestState.Accepted
                  );
                },
              },
              {
                text: "Refuse politely",
                onClick: () =>
                  setChatRequestState(
                    chatRequest.id,
                    ChatRequestState.Declined
                  ),
              },
            ],
            onHide: () => {
              if (!accepted) {
                setChatRequestState(chatRequest.id, ChatRequestState.Declined);
              }
            },
          });
          menuRef.current = myAvatarRef.current;
          setShowMenu(true);
          break;
        case ChatRequestState.Declined:
          setMenu({
            prompt: `${toUser.partyName} declined your request.`,
            choices: [
              {
                text: "OK",
                onClick: () =>
                  setChatRequestState(
                    chatRequest.id,
                    ChatRequestState.Completed
                  ),
              },
            ],
            onHide: () =>
              setChatRequestState(chatRequest.id, ChatRequestState.Completed),
          });
          menuRef.current = myAvatarRef.current;
          setShowMenu(true);
          break;
        case ChatRequestState.Accepted:
          // Join the rooms only once
          if (chatRequest.fromUid === user.uid && !chatRequest.fromJoined) {
            cancelPendingChatRequestsExcept(chatRequest.id);
            joinRoomOwnedBy(chatRequest.toJoinRoomOwnedByUid);
            setChatRequestFromJoined(chatRequest.id);
          }
          if (chatRequest.toUid === user.uid && !chatRequest.toJoined) {
            cancelPendingChatRequestsExcept(chatRequest.id);
            joinRoomOwnedBy(chatRequest.toJoinRoomOwnedByUid);
            setChatRequestToJoined(chatRequest.id);
          }
          if (chatRequest.fromJoined && chatRequest.toJoined) {
            setChatRequestState(chatRequest.id, ChatRequestState.Completed);
          }
          break;
      }
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
    chatRequests,
    ackedRemoves,
  ]);

  const avatars = useMemo(() => {
    if (!user) return;

    const createChatRequest = (
      toUid: string,
      toJoinRoomOwnedByUid: string,
      type: ChatRequestType
    ) => {
      if (!user) return;
      const chatRequest: ChatRequest = {
        fromUid: user.uid,
        toUid,
        toJoinRoomOwnedByUid,
        type,
        state: ChatRequestState.Asked,
        createdAt: new Date().getTime(),
        fromJoined: false,
        toJoined: false,
      };
      firebase
        .firestore()
        .collection(`experiences/playa/chatRequests`)
        .add(chatRequest);

      // Ensure the request doesn't get blocked by stale removes
      if (profile?.video) {
        if (profile.video.removedParticipantUids?.includes(toUid)) {
          profile.video.removedParticipantUids.splice(
            profile.video.removedParticipantUids.indexOf(toUid),
            1
          );
        }
        if (profile.video.removedParticipantUids?.includes(user.uid)) {
          profile.video.removedParticipantUids.splice(
            profile.video.removedParticipantUids.indexOf(user.uid),
            1
          );
        }
        firebase
          .firestore()
          .doc(`users/${user.uid}`)
          .update({ video: profile.video });
      }
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
        if (!avatarUser) return <React.Fragment key={uid} />;

        const videoState = userStateMap[uid].state?.[UserStateKey.Video];

        const viewProfileChoice = {
          text: `${avatarUser.partyName}'s profile`,
          onClick: () => setSelectedUserProfile(avatarUser),
        };
        const askToJoinThemChoice = {
          text: `Ask to join ${avatarUser.partyName}'s chat`,
          onClick: () =>
            createChatRequest(
              uid,
              avatarUser.video?.inRoomOwnedBy
                ? avatarUser.video.inRoomOwnedBy
                : avatarUser.id,
              ChatRequestType.JoinMyChat
            ),
        };
        const inviteThemToJoinYourChatChoice = {
          text: "Invite to join your video chat",
          onClick: () =>
            createChatRequest(uid, user.uid, ChatRequestType.JoinTheirChat),
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

        const address = playaAddress(userStateMap[uid].x, userStateMap[uid].y);

        const generateMenu: () => MenuConfig = () => {
          if (theirChatIsLocked) {
            return {
              prompt: `${avatarUser.partyName}${
                ENABLE_PLAYA_ADDRESS ? `\n${address}` : ""
              }\nNot allowing video chat`,
              choices: [viewProfileChoice],
            };
          }
          if (meIsInAChat && theyAreInAChat && theyAreInAChatWithMe) {
            return {
              prompt: `${avatarUser.partyName}${
                ENABLE_PLAYA_ADDRESS ? `\n${address}` : ""
              }\nCurrently chatting with this person`,
              choices: [viewProfileChoice],
            };
          }
          if (theyAreInAChat && meIsInAChat) {
            if (theirHostsChatIsLocked) {
              return {
                prompt: `${avatarUser.partyName}${
                  ENABLE_PLAYA_ADDRESS ? `\n${address}` : ""
                }\nIn a locked chat hosted by ${
                  theyAreHostOfTheirChat ? "them" : theirChatHostUser?.partyName
                }`,
                choices: [viewProfileChoice],
              };
            } else {
              return {
                prompt: `${avatarUser.partyName}${
                  ENABLE_PLAYA_ADDRESS ? `\n${address}` : ""
                }\nIn an open chat hosted by ${
                  theyAreHostOfTheirChat ? "them" : theirChatHostUser?.partyName
                }`,
                choices: [
                  askToJoinThemChoice,
                  inviteThemToJoinYourChatChoice,
                  viewProfileChoice,
                ],
                cancelable: true,
              };
            }
          }
          if (theyAreInAChat) {
            if (theirHostsChatIsLocked) {
              return {
                prompt: `${avatarUser.partyName}${
                  ENABLE_PLAYA_ADDRESS ? `\n${address}` : ""
                }\nIn a locked chat hosted by ${
                  theyAreHostOfTheirChat ? "them" : theirChatHostUser?.partyName
                }`,
                choices: [viewProfileChoice],
              };
            } else {
              return {
                prompt: `${avatarUser.partyName}${
                  ENABLE_PLAYA_ADDRESS ? `\n${address}` : ""
                }\nIn an open chat hosted by ${
                  theyAreHostOfTheirChat ? "them" : theirChatHostUser?.partyName
                }`,
                choices: [viewProfileChoice, askToJoinThemChoice],
              };
            }
          }
          return {
            prompt: `${avatarUser.partyName}${
              ENABLE_PLAYA_ADDRESS ? `\n${address}` : ""
            }\nOpen to chat`,
            choices: [viewProfileChoice, inviteThemToJoinYourChatChoice],
          };
        };

        return (
          <Avatar
            useProfilePicture={useProfilePicture}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    shouts,
    userStateMap,
    firebase,
    partygoers,
    useProfilePicture,
    setSelectedUserProfile,
    setMenu,
    menuRef,
    setShowMenu,
    setHoveredUser,
    userRef,
    setShowUserTooltip,
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

AvatarLayer.defaultProps = {
  useProfilePicture: false,
};

export default AvatarLayer;
