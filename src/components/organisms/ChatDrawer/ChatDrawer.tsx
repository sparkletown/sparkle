import React, { useContext, useEffect, useState, useMemo } from "react";
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

interface ChatOutDataType {
  messageToTheBand: string;
}

const roomName = "jazz";

const ChatDrawer = () => {
  const { user } = useUser();
  const chats = useSelector((state) => state.firestore.ordered.venueChats);
  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);
  const [isChatDrawerExpanded, setIsChatDrawerExpanded] = useState(false);

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
        .filter((message) => message.type === "room" && message.to === roomName)
        .sort((a, b) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf())),
    [chats]
  );

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
          <div className="call-out-band-container-at-table">
            <CallOutMessageForm
              onSubmit={handleSubmit(onBarMessageSubmit)}
              ref={register({ required: true })}
              placeholder="Chat to the bar"
              isMessageToTheBandSent={isMessageToTheBarSent}
            />
            <div>
              {chatsToDisplay && <MessageList messages={chatsToDisplay} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDrawer;
