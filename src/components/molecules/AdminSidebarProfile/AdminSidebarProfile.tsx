import { useCallback } from "react";

import { Profile } from "types/User";

import { determineAvatar } from "utils/image";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useUserId } from "hooks/user/useUserId";

interface AdminSidebarProfileProps {
  profile?: Profile;
}

export const AdminSidebarProfile: React.FC<AdminSidebarProfileProps> = ({
  profile,
}) => {
  const { userId } = useUserId();

  const { openUserProfileModal } = useProfileModalControls();

  const handleAvatarClick = useCallback(
    () => void openUserProfileModal(userId),
    [openUserProfileModal, userId]
  );

  const { src: avatarSrc, onError: onAvatarLoadError } = determineAvatar({
    user: profile,
  });

  return (
    <div
      className="AdminSidebarProfile flex-shrink-0 flex bg-gray-700 p-4"
      onClick={handleAvatarClick}
    >
      <div className="flex-shrink-0 w-full group block">
        <div className="flex items-center">
          <div>
            <img
              className="inline-block h-9 w-9 rounded-full"
              alt="user's avatar"
              src={avatarSrc}
              onError={onAvatarLoadError}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {profile?.partyName}
            </p>
            <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
              View profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
