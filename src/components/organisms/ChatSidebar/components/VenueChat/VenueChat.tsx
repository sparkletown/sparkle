import React from "react";

import { Chatbox } from "components/molecules/Chatbox_NEW";

import { useVenueChat } from "hooks/useVenueChat";

import { OnAvatarClick } from "types/User";

import "./VenueChat.scss";

export interface VenueChatProps {
  onAvatarClick: OnAvatarClick;
}

export const VenueChat: React.FC<VenueChatProps> = ({ onAvatarClick }) => {
  const { sendMessage, deleteMessage, messagesToDisplay } = useVenueChat();

  return (
    <div className="venue-chat-container">
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
        onAvatarClick={onAvatarClick}
      />
    </div>
  );
};
