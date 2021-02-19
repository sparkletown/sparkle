import React from "react";

import { Chatbox } from "components/molecules/Chatbox";

import { useVenueChat } from "hooks/useVenueChat";

import { SetSelectedProfile } from "types/chat";

import "./VenueChat.scss";

export interface VenueChatProps {
  onAvatarClick: SetSelectedProfile;
}

export const VenueChat: React.FC<VenueChatProps> = ({ onAvatarClick }) => {
  const { sendMessage, deleteMessage, messagesToDisplay } = useVenueChat();

  return (
    <div className="venue-chat">
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
        onAvatarClick={onAvatarClick}
      />
    </div>
  );
};
