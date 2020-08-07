import React, { useState, useEffect, useRef } from "react";
import UserProfileModal from "components/organisms/UserProfileModal";
import { Dropdown, FormControl } from "react-bootstrap";
import { debounce } from "lodash";

import { isChatValid } from "validation";

import ChatForm from "./ChatForm";
import "./Chatbox.scss";
import { User } from "types/User";
import ChatMessage from "components/molecules/ChatMessage";
import { useUser } from "hooks/useUser";
import { useKeyedSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "react-redux-firebase";

// Don't pull everything
// REVISIT: only grab most recent N from server
const RECENT_MESSAGE_COUNT = 200;

interface PropsType {
  isInProfileModal?: boolean;
  displayNameOfDiscussionPartnerAsTitle?: boolean;
  discussionPartner?: User;
  room?: string;
}

const Chatbox: React.FunctionComponent<PropsType> = ({
  isInProfileModal,
  discussionPartner,
  displayNameOfDiscussionPartnerAsTitle,
  room,
}) => {
  const [isRecipientChangeBlocked, setIsRecipientChangeBlocked] = useState(
    false
  );
  const [privateRecipient, setPrivateRecipient] = useState<User>();
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();
  const [chatboxMessageType, setChatboxMessageType] = useState(
    room ? "room" : "global"
  );

  useFirestoreConnect("users");

  const { user } = useUser();
  const { users, userArray, chats, privateChats } = useKeyedSelector(
    (state) => ({
      users: state.firestore.data.users,
      userArray: state.firestore.ordered.users,
      chats: state.firestore.ordered.venueChats,
      privateChats: state.firestore.ordered.privatechats,
    }),
    ["users"]
  );

  useFirestoreConnect({
    collection: "privatechats",
    doc: user?.uid,
    subcollections: [{ collection: "chats" }],
    storeAs: "privatechats",
  });

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = debounce((v) => setSearchValue(v), 500);
  const searchRef = useRef<HTMLInputElement>(null);

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
      .sort((a, b) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf()))
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
          setPrivateRecipient({ ...users[lastChat?.from] });
        } else {
          setPrivateRecipient({ ...users[lastChat?.to] });
        }
      }
    }
    // chatsToDisplay is computed with chats and privateChats, it does not need to be a dependency
    // eslint-disable-next-line
  }, [
    setPrivateRecipient,
    chats,
    privateChats,
    isInProfileModal,
    isRecipientChangeBlocked,
    user,
    users,
  ]);

  return (
    <>
      <div className="chatbox-container">
        {discussionPartner && displayNameOfDiscussionPartnerAsTitle ? (
          <div className="discussion-partner-info">
            <img
              className="profile-picture"
              src={discussionPartner.pictureUrl}
              alt="profile"
            />
            {discussionPartner.partyName}
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
                          src={privateRecipient.pictureUrl}
                          className="picture-logo"
                          alt={privateRecipient.partyName}
                          width="20"
                          height="20"
                        />
                        {privateRecipient.partyName}
                      </>
                    ) : (
                      <>
                        {chatboxMessageType === "global" ? "Everybody" : ""}
                        {chatboxMessageType === "room"
                          ? room === "jazz"
                            ? "Chat to the band"
                            : `This Room: ${room}`
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
                      placeholder="Search for partygoer..."
                      onChange={(e) => {
                        debouncedSearch(e.target.value);
                      }}
                      ref={searchRef}
                    />
                    {searchValue && (
                      <ul className="list-unstyled">
                        {userArray
                          .filter((u) =>
                            u.partyName
                              ?.toLowerCase()
                              .includes(searchValue.toLowerCase())
                          )
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
                    key={chat.ts_utc.valueOf()}
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
