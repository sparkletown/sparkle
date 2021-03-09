import { ProfilePopoverContent } from "components/organisms/ProfileModal";
import { useUser } from "hooks/useUser";
import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import { DEFAULT_PROFILE_IMAGE } from "settings";

export const NavbarProfile = () => {
  const { profile } = useUser();

  const profileImage = profile?.pictureUrl || DEFAULT_PROFILE_IMAGE;

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-end"
      overlay={
        <Popover id="profile-popover">
          <Popover.Content>
            <ProfilePopoverContent />
          </Popover.Content>
        </Popover>
      }
      rootClose={true}
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
