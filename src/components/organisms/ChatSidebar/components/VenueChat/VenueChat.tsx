import React from "react";

import { Chatbox } from "components/molecules/Chatbox";

import { useVenueChat } from "hooks/useVenueChat";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import "./VenueChat.scss";

export const VenueChat: React.FC = () => {
  const { openUserProfileModal } = useProfileModalControls();
  const { sendMessage, deleteMessage, messagesToDisplay } = useVenueChat();

  return (
    <div className="venue-chat">
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
        onAvatarClick={openUserProfileModal}
      />
    </div>
  );
};
