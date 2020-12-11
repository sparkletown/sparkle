import React, { useEffect, useState, useMemo } from "react";
import firebase from "firebase/app";
import { MessageList } from "components/molecules/MessageList";
import CallOutMessageForm from "components/molecules/CallOutMessageForm";
import { useForm } from "react-hook-form";
import { chatSort } from "utils/chat";
import "./ChatDrawer.scss";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faAngleDoubleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "hooks/useDispatch";
import useRoles from "hooks/useRoles";
import { useVenueId } from "hooks/useVenueId";
import { getDaysAgoInSeconds } from "utils/time";
import { VENUE_CHAT_AGE_DAYS } from "settings";
import { currentVenueSelectorData } from "utils/selectors";
import { sendRoomChat } from "store/actions/Chat";

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
  const venue = useSelector(currentVenueSelectorData);

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

  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onBarMessageSubmit = async (data: ChatOutDataType) => {
    setIsMessageToTheBarSent(true);
    user &&
      venueId &&
      dispatch(
        sendRoomChat({
          venueId,
          from: user.uid,
          to: roomName,
          text: data.messageToTheBand,
        })
      );
    reset();
  };

  function roundToNearestHour(seconds: number) {
    const oneHour = 60 * 60;
    return Math.floor(seconds / oneHour) * oneHour;
  }
  const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
  const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

  const chatsToDisplay = useMemo(
    () =>
      chats &&
      chats
        .filter(
          (message) =>
            message.deleted !== true &&
            message.type === "room" &&
            message.to === roomName &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort(chatSort),
    [chats, roomName, HIDE_BEFORE]
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
          <h4>Chat with everybody</h4>
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
