import { Button } from "components/attendee/Button";

import { DEFAULT_PARTY_NAME, PERSON_TAXON } from "settings";

import { UserWithId } from "types/id";
import { UserWithLocation } from "types/User";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";

import CN from "../SearchOverlay.module.scss";

export type UserItemProps = {
  user: Pick<UserWithLocation, "partyName" | "pictureUrl" | "enteredVenueIds">;
  onClick: () => void;
};

export const UserItem: React.FC<UserItemProps> = ({ user, onClick }) => {
  const {
    selectPrivateChat,
    isExpanded,
    expandSidebar,
    selectRecipientChat,
  } = useChatSidebarControls();

  const handleSendMessage = () => {
    !isExpanded && expandSidebar();
    selectPrivateChat();
    selectRecipientChat(user as UserWithId);
    onClick();
  };

  return (
    <div>
      <div className={CN.searchItemResultHeader}>
        <h3 className={CN.searchItemResultTitle}>
          {user?.partyName ?? DEFAULT_PARTY_NAME}
          <span>{PERSON_TAXON.title}</span>
        </h3>
      </div>
      <Button
        variant="alternative"
        border="alternative"
        onClick={handleSendMessage}
        marginless
      >
        Send Message
      </Button>
    </div>
  );
};
