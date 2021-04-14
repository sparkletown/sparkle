import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import { DEFAULT_PROFILE_IMAGE } from "settings";

import { useUser } from "hooks/useUser";

import { ProfilePopoverContent } from "components/organisms/ProfileModal";

export const NavbarProfile: React.FC = () => {
  const { profile } = useUser();

  const profileImage = profile?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-end"
      rootClose={true}
      overlay={
        <Popover id="profile-popover">
          <Popover.Content>
            <ProfilePopoverContent />
          </Popover.Content>
        </Popover>
      }
    >
      <div className="navbar-link-profile">
        <img
          src={profileImage}
          className="profile-icon"
          alt="avatar"
          width="40"
          height="40"
        />
      </div>
    </OverlayTrigger>
  );
};
