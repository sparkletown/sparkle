import React, { useState, useEffect, useMemo, useRef } from "react";
import UserProfileModal from "components/organisms/UserProfileModal";
import { Dropdown, FormControl } from "react-bootstrap";
import { debounce } from "lodash";

import { isChatValid } from "validation";

import ChatForm from "./ChatForm";
import "./Chatbox.scss";
import { User } from "types/User";
import ChatMessage from "components/molecules/ChatMessage";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "react-redux-firebase";
import { WithId } from "utils/id";
import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";
import { chatSort } from "components/context/ChatContext";
import {
  partygoersSelector,
  partygoersSelectorData,
  privateChatsSelector,
  venueChatsSelector,
} from "utils/selectors";

// Don't pull everything
// REVISIT: only grab most recent N from server
const RECENT_MESSAGE_COUNT = 200;

interface PropsType {
  isInProfileModal?: boolean;
  displayNameOfDiscussionPartnerAsTitle?: boolean;
  discussionPartner?: WithId<User>;
  room?: string;
}

// TODO: we have a ChatBox in organisms but also in molecules.. are they the same? Can we de-dupe them?
const Chatbox: React.FunctionComponent<PropsType> = ({
  isInProfileModal,
  discussionPartner,
  displayNameOfDiscussionPartnerAsTitle,
  room,
}) => {
  const [isRecipientChangeBlocked, setIsRecipientChangeBlocked] = useState(
    false
  );
  const [privateRecipient, setPrivateRecipient] = useState<WithId<User>>();
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [chatboxMessageType, setChatboxMessageType] = useState(
    room ? "room" : "global"
  );

  const { user } = useUser();
  const users = useSelector(partygoersSelectorData);
  const userArray = useSelector(partygoersSelector) ?? [];

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = debounce((v) => setSearchValue(v), 500);
  const searchRef = useRef<HTMLInputElement>(null);

  useFirestoreConnect(
    user && user.uid
      ? {
          collection: "privatechats",
          doc: user.uid,
          subcollections: [{ collection: "chats" }],
          storeAs: "privatechats",
        }
      : undefined
  );
  const chats = useSelector(venueChatsSelector);
  const privateChats = useSelector(privateChatsSelector);
  const chatsToDisplay = useMemo(() => {
    const listOfChats =
      chats &&
      privateChats &&
      (isInProfileModal ? privateChats : [...privateChats, ...chats]);

    let chatsToDisplay =
      listOfChats &&
      listOfChats
        .filter(isChatValid)
        .filter((chat) =>
          room
            ? //@ts-ignore
              chat.type === "global" || //@debt can privateChats or venueChats ever be global?
              (chat.type === "room" && chat.to === room)
            : true
        )
        .concat()
        .sort(chatSort)
        .slice(0, RECENT_MESSAGE_COUNT);

    if (user && isInProfileModal && discussionPartner) {
      chatsToDisplay =
        chatsToDisplay &&
        chatsToDisplay.filter(
          (chat) =>
            (chat.from === discussionPartner?.id && chat.to === user.uid) ||
            (chat.to === discussionPartner?.id && chat.from === user.uid)
        );
    }

    return chatsToDisplay;
  }, [chats, privateChats, discussionPartner, isInProfileModal, user, room]);

  const changeChatboxMessageType = (type: string) => {
    setIsRecipientChangeBlocked(true);
    setChatboxMessageType(type);
    setPrivateRecipient(undefined);
  };

  useEffect(() => {
    if (!user) return;
    if (!isRecipientChangeBlocked) {
      const lastChat = chatsToDisplay && chatsToDisplay[0];
      setPrivateRecipient(undefined);
      if (!isInProfileModal && lastChat && lastChat.type === "private") {
        if (lastChat?.to === user.uid) {
          setPrivateRecipient(userArray.find((u) => u.id === lastChat?.from));
        } else {
          setPrivateRecipient(userArray.find((u) => u.id === lastChat?.to));
        }
      }
    }
  }, [
    chatsToDisplay,
    setPrivateRecipient,
    isInProfileModal,
    isRecipientChangeBlocked,
    user,
    userArray,
  ]);

  return (
    <>
      <div className="chatbox-container">
        {discussionPartner && displayNameOfDiscussionPartnerAsTitle ? (
          <div className="discussion-partner-info">
            <img
              className="profile-picture"
              src={
                discussionPartner.anonMode
                  ? DEFAULT_PROFILE_IMAGE
                  : discussionPartner.pictureUrl ?? DEFAULT_PROFILE_IMAGE
              }
              alt="profile"
            />
            {discussionPartner.anonMode
              ? DEFAULT_PARTY_NAME
              : discussionPartner.partyName ?? DEFAULT_PARTY_NAME}
          </div>
        ) : (
          <div className="chatbox-title">
            <img
              src="/sparkle-icon.png"
              className="side-title-icon"
              alt="sparkle icon"
              width="20"
            />
            Chat
          </div>
        )}

        {users && (
          <>
            {!isInProfileModal && (
              <div className="dropdown-container">
                <label className="recipient-label" htmlFor="type-of-message">
                  To:
                </label>
                <Dropdown
                  onToggle={(isOpen: boolean) => {
                    if (!isOpen) {
                      setSearchValue("");
                      if (searchRef?.current) {
                        searchRef.current.value = "";
                      }
                    }
                  }}
                >
                  <Dropdown.Toggle id="dropdown-basic">
                    {privateRecipient ? (
                      <>
                        <img
                          src={
                            privateRecipient.anonMode
                              ? DEFAULT_PROFILE_IMAGE
                              : privateRecipient.pictureUrl
                          }
                          className="picture-logo"
                          alt={
                            privateRecipient.anonMode
                              ? DEFAULT_PARTY_NAME
                              : privateRecipient.partyName
                          }
                          width="20"
                          height="20"
                        />
                        {privateRecipient.anonMode
                          ? DEFAULT_PARTY_NAME
                          : privateRecipient.partyName}
                      </>
                    ) : (
                      <>
                        {chatboxMessageType === "global" ? "Everybody" : ""}
                        {chatboxMessageType === "room"
                          ? `This room: ${room}`
                          : ""}
                      </>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => changeChatboxMessageType("global")}
                      id="chatbox-dropdown-everybody"
                    >
                      Everybody
                    </Dropdown.Item>
                    {room && (
                      <Dropdown.Item
                        onClick={() => changeChatboxMessageType("room")}
                        id="chatbox-dropdown-room"
                      >
                        This Room: {room}
                      </Dropdown.Item>
                    )}
                    <FormControl
                      autoFocus
                      className="mx-3 my-2 w-auto"
                      placeholder="Search for attendee..."
                      onChange={(e) => {
                        debouncedSearch(e.target.value);
                      }}
                      ref={searchRef}
                    />
                    {searchValue && (
                      <ul className="list-unstyled">
                        {userArray
                          .filter(
                            (u) =>
                              !u.anonMode &&
                              u.partyName
                                ?.toLowerCase()
                                .includes(searchValue.toLowerCase())
                          )
                          .filter((u) => u.id !== undefined)
                          .map((u) => (
                            <Dropdown.Item
                              onClick={() => setPrivateRecipient(u)}
                              id="chatbox-dropdown-private-recipient"
                              key={u.id}
                            >
                              <img
                                src={u.pictureUrl}
                                className="picture-logo"
                                alt={u.partyName}
                                width="20"
                                height="20"
                              />
                              {u.partyName}
                            </Dropdown.Item>
                          ))}
                      </ul>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}

            <ChatForm
              type={
                isInProfileModal || privateRecipient
                  ? "private"
                  : chatboxMessageType
              }
              discussionPartner={privateRecipient || discussionPartner}
              currentUserUID={user?.uid}
              room={room}
              setIsRecipientChangeBlocked={setIsRecipientChangeBlocked}
            />
            <div className="message-container">
              {chatsToDisplay &&
                user &&
                chatsToDisplay.map((chat) => (
                  <ChatMessage
                    key={`${chat.ts_utc.valueOf()}-${chat.id}`}
                    user={user}
                    users={users}
                    setSelectedUserProfile={setSelectedUserProfile}
                    isInProfileModal={!!isInProfileModal}
                    chat={chat}
                    withoutSenderInformation={
                      displayNameOfDiscussionPartnerAsTitle
                    }
                  />
                ))}
            </div>
          </>
        )}
      </div>
      {!discussionPartner && (
        <UserProfileModal
          show={selectedUserProfile !== undefined}
          onHide={() => setSelectedUserProfile(undefined)}
          userProfile={selectedUserProfile}
        />
      )}
    </>
  );
};

export default Chatbox;
