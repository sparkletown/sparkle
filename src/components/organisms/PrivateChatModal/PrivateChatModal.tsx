import React, { useState, useRef } from "react";
import "./PrivateChatModal.scss";
import { useSelector } from "react-redux";
import { PrivateChatMessage } from "components/context/ChatContext";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import Chatbox from "components/organisms/Chatbox";
import { formatUtcSeconds } from "utils/time";
import { User } from "types/User";
import { setPrivateChatMessageIsRead } from "./helpers";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from "lodash";
import { FormControl, Dropdown } from "react-bootstrap";

interface LastMessageByUser {
  [userId: string]: PrivateChatMessage;
}

const PrivateChatModal: React.FunctionComponent = () => {
  const { privateChats, users, user, userArray } = useSelector(
    (state: any) => ({
      privateChats: state.firestore.ordered.privatechats,
      users: state.firestore.data.users,
      user: state.user,
      userArray: state.firestore.ordered.users,
    })
  );
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = debounce((v) => setSearchValue(v), 500);
  const searchRef = useRef<HTMLInputElement>(null);

  const discussionPartnerWithLastMessageExchanged =
    privateChats &&
    privateChats.reduce((agg: LastMessageByUser, item: PrivateChatMessage) => {
      let lastMessageTimeStamp;
      let discussionPartner;
      if (item.from === user.uid) {
        discussionPartner = item.to;
      } else {
        discussionPartner = item.from;
      }
      try {
        lastMessageTimeStamp = agg[discussionPartner].ts_utc;
        if (lastMessageTimeStamp < item.ts_utc) {
          agg[discussionPartner] = item;
        }
      } catch {
        agg[discussionPartner] = item;
      }
      return agg;
    }, {});

  const onClickOnSender = (sender: User) => {
    const chatsToUpdate = privateChats.filter(
      (chat: PrivateChatMessage) => !chat.isRead && chat.from === sender.id
    );
    chatsToUpdate.map((chat: PrivateChatMessage & { id: string }) =>
      setPrivateChatMessageIsRead(user.uid, chat.id)
    );
    setSelectedUser(sender);
  };

  const onClickOnUserInSearchInput = (user: User) => {
    setSelectedUser(user);
    setSearchValue("");
  };

  return (
    <div className="private-chat-modal-container">
      {selectedUser ? (
        <div className="chat-container">
          <div
            className="back-button"
            onClick={() => setSelectedUser(undefined)}
            id="private-chat-back-button"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <Chatbox
            discussionPartner={selectedUser}
            isInProfileModal
            displayNameOfDiscussionPartnerAsTitle
          />
        </div>
      ) : (
        discussionPartnerWithLastMessageExchanged && (
          <>
            <h2 className="private-chat-title">Private Chat</h2>
            <Dropdown className="private-recipient-input">
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
                <ul className="floating-dropdown">
                  {userArray
                    .filter((u: User) =>
                      u.partyName
                        ?.toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .map((u: User) => (
                      <Dropdown.Item
                        onClick={() => onClickOnUserInSearchInput(u)}
                        id="private-chat-dropdown-private-recipient"
                        className="private-recipient"
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
            </Dropdown>
            {Object.keys(discussionPartnerWithLastMessageExchanged)
              .sort(
                (a, b) =>
                  discussionPartnerWithLastMessageExchanged[b].ts_utc -
                  discussionPartnerWithLastMessageExchanged[a].ts_utc
              )
              .map((userId: string) => {
                const sender = { ...users[userId], id: userId };
                const lastMessageExchanged =
                  discussionPartnerWithLastMessageExchanged[userId];
                return (
                  <div
                    key={userId}
                    className="private-message-sender"
                    onClick={() => onClickOnSender(sender)}
                    id="private-chat-modal-select-private-recipient"
                  >
                    <UserProfilePicture
                      user={sender}
                      setSelectedUserProfile={() => null}
                      imageSize={50}
                    />
                    <div className="sender-info-container">
                      <div className="sender-party-name">
                        {sender.partyName}
                      </div>
                      <div className="sender-last-message">
                        {lastMessageExchanged.text}
                      </div>
                      <div>{formatUtcSeconds(lastMessageExchanged.ts_utc)}</div>
                    </div>
                    {lastMessageExchanged.from !== user.uid &&
                      !lastMessageExchanged.isRead && (
                        <div className="not-read-indicator" />
                      )}
                  </div>
                );
              })}
          </>
        )
      )}
    </div>
  );
};

export default PrivateChatModal;
