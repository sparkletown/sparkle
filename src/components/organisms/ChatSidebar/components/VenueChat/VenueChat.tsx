import React from "react";

import { Chatbox } from "components/molecules/Chatbox";

import { useVenueChat } from "hooks/useVenueChat";
import { useChatSidebarControls } from "hooks/chatSidebar";

import "./VenueChat.scss";

export const VenueChat: React.FC = () => {
  const {
    sendMessage,
    deleteMessage,
    messagesToDisplay,
    sendThreadReply,
  } = useVenueChat();
  const { selectVenueChat } = useChatSidebarControls();

  return (
    <div className="venue-chat" onClick={() => selectVenueChat()}>
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        sendThreadReply={sendThreadReply}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
