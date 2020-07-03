import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import UserProfileModal from "components/organisms/UserProfileModal";
import { Dropdown, FormControl } from "react-bootstrap";
import { debounce } from "lodash";

import { isChatValid } from "validation";

import ChatForm from "./ChatForm";
import "./Chatbox.scss";
import { User } from "types/User";
import ChatMessage from "components/molecules/ChatMessage";

// Don't pull everything
// REVISIT: only grab most recent N from server
const RECENT_MESSAGE_COUNT = 200;

interface PropsType {
  isInProfileModal?: boolean;
  discussionPartner?: User;
  room?: string;
}

const Chatbox: React.FunctionComponent<PropsType> = ({
  isInProfileModal,
  discussionPartner,
  room,
}) => {
  const [isRecipientChangeBlocked, setIsRecipientChangeBlocked] = useState(
    false
  );
  const [privateRecipient, setPrivateRecipient] = useState<User>();
  const [selectedUserProfile, setSelectedUserProfile] = useState();
  const [chatboxMessageType, setChatboxMessageType] = useState(
    room ? "room" : "global"
  );

  const {
    users,
    userArray,
    currentUserUID,
    chats,
    user,
    privateChats,
  } = useSelector((state: any) => ({
    users: state.firestore.data.users,
    userArray: state.firestore.ordered.users,
    currentUserUID: state.user.uid,
    chats: state.firestore.ordered.venueChats,
    privateChats: state.firestore.ordered.privatechats,
    user: state.user,
  }));

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = debounce((v) => setSearchValue(v), 500);
  const searchRef = useRef<HTMLInputElement>(null);

  const listOfChats =
    chats &&
    privateChats &&
    (isInProfileModal ? privateChats : privateChats.concat(chats));

  let chatsToDisplay =
    listOfChats &&
    listOfChats
      .filter(isChatValid)
      .filter((chat: any) =>
        room
          ? chat.type === "global" ||
            chat.type === "private" ||
            (chat.type === "room" && chat.to === room)
          : true
      )
      .concat()
      .sort((a: any, b: any) => b.ts_utc - a.ts_utc)
      .slice(0, RECENT_MESSAGE_COUNT);

  if (isInProfileModal && discussionPartner) {
    chatsToDisplay =
      chatsToDisplay &&
      chatsToDisplay.filter(
        (chat: any) =>
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
    if (!isRecipientChangeBlocked) {
      const lastChat = chatsToDisplay && chatsToDisplay[0];
      setPrivateRecipient(undefined);
      if (!isInProfileModal && lastChat && lastChat.type === "private") {
        if (lastChat?.to === user.uid) {
          setPrivateRecipient({ ...users[lastChat?.from], id: lastChat?.from });
        } else {
          setPrivateRecipient({ ...users[lastChat?.to], id: lastChat?.to });
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
    user.uid,
    users,
  ]);

  return (
    <>
      <div className="chatbox-container">
        <div className="chatbox-title">
          <img
            src="/sparkle-icon.png"
            className="side-title-icon"
            alt="sparkle icon"
            width="20"
          />
          Chat
        </div>
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
                    >
                      Everybody
                    </Dropdown.Item>
                    {room && (
                      <Dropdown.Item
                        onClick={() => changeChatboxMessageType("room")}
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
                          .filter((u: any) =>
                            u.partyName
                              ?.toLowerCase()
                              .includes(searchValue.toLowerCase())
                          )
                          .map((u: any) => (
                            <Dropdown.Item
                              onClick={() => setPrivateRecipient(u)}
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
              currentUserUID={currentUserUID}
              room={room}
              setIsRecipientChangeBlocked={setIsRecipientChangeBlocked}
            />
            <div className="message-container">
              {chatsToDisplay &&
                chatsToDisplay.map((chat: any) => (
                  <ChatMessage
                    key={chat.id}
                    user={user}
                    users={users}
                    setSelectedUserProfile={setSelectedUserProfile}
                    isInProfileModal={!!isInProfileModal}
                    chat={chat}
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
