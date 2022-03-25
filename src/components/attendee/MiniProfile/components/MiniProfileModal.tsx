import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
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

export interface MiniProfileModalProps {
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

  const [{ loading: isLoggingOut }, logout] = useAsyncFn(async () => {
    await firebase.auth().signOut();
    closeUserProfileModal();

    history.push(generateAttendeeSpaceLandingUrl(worldSlug, spaceSlug));
  }, [closeUserProfileModal, history, worldSlug, spaceSlug]);

  const isCurrentUser = useIsCurrentUser(profile.id);

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

        {isCurrentUser ? (
          <Card.Button variant="danger" onClick={logout}>
            {isLoggingOut ? "Logging Out..." : "Log Out"}
          </Card.Button>
        ) : (
          <Card.Button variant="intensive" onClick={openChat}>
            Send message
          </Card.Button>
        )}
      </Card>
    </div>
  );
};
