import React, { useContext, useEffect, useState } from "react";
import MessageList from "components/molecules/MessageList";
import CallOutMessageForm from "components/molecules/CallOutMessageForm";
import { useForm } from "react-hook-form";
import { ChatContext } from "components/context/ChatContext";
import "./ChatDrawer.scss";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";

interface ChatOutDataType {
  messageToTheBand: string;
}

const ChatDrawer = () => {
  const roomName = "jazz";
  const { user } = useUser();
  const { usersById, chats } = useSelector((state) => ({
    usersById: state.firestore.data.users,
    chats: state.firestore.ordered.venueChats,
  }));

  const [isMessageToTheBarSent, setIsMessageToTheBarSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBarSent) {
      setTimeout(() => {
        setIsMessageToTheBarSent(false);
      }, 2000);
    }
  }, [isMessageToTheBarSent, setIsMessageToTheBarSent]);

  const chatContext = useContext(ChatContext);
  const onBarMessageSubmit = async (data: ChatOutDataType) => {
    chatContext &&
      user &&
      chatContext.sendRoomChat(user.uid, roomName, data.messageToTheBand);
    setBarMessageValue([{ messageToTheBand: "" }]);
  };

  const {
    register: registerBarMessage,
    handleSubmit: handleBarMessageSubmit,
    setValue: setBarMessageValue,
  } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  return (
    <div className="chat-drawer-container">
      <div className="band-reaction-container">
        <div className="call-out-band-container-at-table">
          <CallOutMessageForm
            onSubmit={handleBarMessageSubmit(onBarMessageSubmit)}
            register={registerBarMessage}
            placeholder="Chat to the bar"
            isMessageToTheBandSent={isMessageToTheBarSent}
          />
          <div>
            {usersById && chats && (
              <MessageList
                messages={chats
                  .filter(
                    (message) =>
                      message.type === "room" && message.to === roomName
                  )
                  .sort((a, b) =>
                    b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf())
                  )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;
