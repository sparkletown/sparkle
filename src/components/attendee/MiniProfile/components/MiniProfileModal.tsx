import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Card } from "components/attendee/Card";
import { SpentTime } from "components/shared/SpentTime";
import firebase from "firebase/compat/app";

import { UserId, UserWithId } from "types/id";

import { generateAttendeeSpaceLandingUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import { MiniProfileModalLinks } from "./MiniProfileModalLinks";

import styles from "./MiniProfileModal.module.scss";

interface MiniProfileModalProps {
  profile: UserWithId;
  userId: UserId;
}

export const MiniProfileModal: React.FC<MiniProfileModalProps> = ({
  profile,
}) => {
  const { worldSlug, spaceSlug } = useSpaceParams();

  const history = useHistory();

  const { selectRecipientChat } = useChatSidebarControls();

  const { closeUserProfileModal } = useProfileModalControls();

  const openChat = useCallback(() => {
    selectRecipientChat(profile);
    closeUserProfileModal();
  }, [selectRecipientChat, profile, closeUserProfileModal]);

  const logout = useCallback(async () => {
    await firebase.auth().signOut();
    closeUserProfileModal();

    history.push(generateAttendeeSpaceLandingUrl(worldSlug, spaceSlug));
  }, [closeUserProfileModal, history, worldSlug, spaceSlug]);

  const isCurrentUser = useIsCurrentUser(profile.id);

  const actionButton = isCurrentUser ? (
    <Card.Button variant="danger" onClick={logout}>
      Log Out
    </Card.Button>
  ) : (
    <Card.Button variant="intensive" onClick={openChat}>
      Send message
    </Card.Button>
  );

  return (
    <div data-bem="MiniProfileModal">
      <Card>
        <Card.Body>
          <div className={styles.mainInfo}>
            <UserAvatar user={profile} clickable={false} size="medium" />

            <div className={styles.mainInfoText}>
              <span>{profile.partyName}</span>
              <MiniProfileModalLinks profileLinks={profile.profileLinks} />
            </div>
          </div>

          <SpentTime userId={profile.id} />
        </Card.Body>

        {actionButton}
      </Card>
    </div>
  );
};
