import { UserId } from "types/id";

import { useProfileById } from "hooks/user/useProfileById";

import { UserAvatar } from "components/atoms/UserAvatar";

import styles from "./WebcamGridAvatar.module.scss";

interface WebcamGridAvatarProps {
  userId: UserId;
}

export const WebcamGridAvatar: React.FC<WebcamGridAvatarProps> = ({
  userId,
}) => {
  const { profile, isLoading } = useProfileById({
    userId: userId,
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <UserAvatar
        containerClassName={styles.avatarContainer}
        user={profile}
        clickable={false}
      />
      <span className={styles.userName}>{profile?.partyName}</span>
    </div>
  );
};
