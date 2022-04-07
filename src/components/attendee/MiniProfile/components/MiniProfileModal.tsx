import { useCallback } from "react";
import { Card } from "components/attendee/Card";
import { SpentTime } from "components/shared/SpentTime";

import { UserId, UserWithId } from "types/id";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import { MiniProfileModalLinks } from "./MiniProfileModalLinks";

import CN from "./MiniProfileModal.module.scss";

export interface MiniProfileModalProps {
  profile: UserWithId;
  userId: UserId;
}

export const MiniProfileModal: React.FC<MiniProfileModalProps> = ({
  profile,
}) => {
  const { selectRecipientChat } = useChatSidebarControls();

  const { closeUserProfileModal } = useProfileModalControls();

  const openChat = useCallback(() => {
    selectRecipientChat(profile);
    closeUserProfileModal();
  }, [selectRecipientChat, profile, closeUserProfileModal]);

  const isCurrentUser = useIsCurrentUser(profile.id);

  return (
    <div data-bem="MiniProfileModal">
      <Card withoutButton={isCurrentUser}>
        <Card.Body>
          <div className={CN.mainInfo}>
            <UserAvatar user={profile} clickable={false} size="medium" />

            <div className={CN.mainInfoText}>
              <span>{profile.partyName}</span>
              <MiniProfileModalLinks profileLinks={profile.profileLinks} />
            </div>
          </div>

          <SpentTime userId={profile.id} />
        </Card.Body>

        {!isCurrentUser && (
          <Card.Button variant="intensive" onClick={openChat}>
            Send message
          </Card.Button>
        )}
      </Card>
    </div>
  );
};
