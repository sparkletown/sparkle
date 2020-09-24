import React, { useContext, useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import { MessageList } from "components/molecules/MessageList";
import CallOutMessageForm from "components/molecules/CallOutMessageForm";
import { useForm } from "react-hook-form";
import { ChatContext } from "components/context/ChatContext";
import "./ChatDrawer.scss";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faAngleDoubleLeft,
} from "@fortawesome/free-solid-svg-icons";
import useRoles from "hooks/useRoles";
import { useVenueId } from "hooks/useVenueId";

interface ChatOutDataType {
  messageToTheBand: string;
}

interface PropsType {
  roomName: string;
  chatInputPlaceholder: string;
  title: string;
  defaultShow?: boolean;
}

const ChatDrawer: React.FC<PropsType> = ({
  roomName,
  chatInputPlaceholder,
  title,
  defaultShow,
}) => {
  const { user } = useUser();
  const venueId = useVenueId();
  const { userRoles } = useRoles();
  const venue = useSelector((state) => state.firestore.data.currentVenue);

  const chats = useSelector((state) => state.firestore.ordered.venueChats);
  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);
  const [isChatDrawerExpanded, setIsChatDrawerExpanded] = useState(defaultShow);

  useEffect(() => {
    if (isMessageToTheBarSent) {
      setTimeout(() => {
        setIsMessageToTheBarSent(false);
      }, 2000);
    }
  }, [isMessageToTheBarSent]);

  const chatContext = useContext(ChatContext);

  const { register, handleSubmit, reset } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onBarMessageSubmit = async (data: ChatOutDataType) => {
    setIsMessageToTheBarSent(true);
    chatContext &&
      user &&
      chatContext.sendRoomChat(user.uid, roomName, data.messageToTheBand);
    reset();
  };
  const chatsToDisplay = useMemo(
    () =>
      chats &&
      chats
        .filter(
          (message) =>
            message.deleted !== true &&
            message.type === "room" &&
            message.to === roomName
        )
        .sort((a, b) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf())),
    [chats, roomName]
  );

  const allowDelete =
    ((userRoles && userRoles.includes("admin")) ||
      (user && venue?.owners?.includes(user.uid))) ??
    false;

  const deleteMessage = async (id: string) => {
    await firebase
      .firestore()
      .doc(`venues/${venueId}/chats/${id}`)
      .update({ deleted: true });
  };

  return (
    <div
      className={`chat-drawer-container ${
        isChatDrawerExpanded ? "expanded" : ""
      }`}
      onClick={() => !isChatDrawerExpanded && setIsChatDrawerExpanded(true)}
    >
      <div className="chevron-container">
        <div
          className={`rotating-chevron ${
            isChatDrawerExpanded ? "expanded" : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faAngleDoubleLeft}
            size="lg"
            onClick={() => setIsChatDrawerExpanded(!isChatDrawerExpanded)}
          />
        </div>
      </div>
      {!isChatDrawerExpanded ? (
        <div className="chat-icon-container">
          <FontAwesomeIcon icon={faCommentDots} className="chat-icon" />
        </div>
      ) : (
        <div className="band-reaction-container">
          <h3>{title}</h3>
          <div className="call-out-band-container-at-table">
            <CallOutMessageForm
              onSubmit={handleSubmit(onBarMessageSubmit)}
              ref={register({ required: true })}
              placeholder={chatInputPlaceholder}
              isMessageToTheBandSent={isMessageToTheBarSent}
            />
            <div>
              {chatsToDisplay && (
                <MessageList
                  messages={chatsToDisplay}
                  allowDelete={allowDelete}
                  deleteMessage={deleteMessage}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDrawer;
