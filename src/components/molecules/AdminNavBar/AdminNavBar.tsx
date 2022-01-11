import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { enterSpace } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";

import { BackButton } from "components/atoms/BackButton";
import { UserAvatar } from "components/atoms/UserAvatar";

import { NavBarLogin } from "./components/NavBarLogin";

import "./AdminNavBar.scss";
import "./playa.scss";

interface AdminNavBarPropsType {
  hasBackButton?: boolean;
  withHiddenLoginButton?: boolean;
  title?: string;
}

export const AdminNavBar: React.FC<AdminNavBarPropsType> = ({
  hasBackButton,
  title,
  withHiddenLoginButton,
}) => {
  const { user, userWithId } = useUser();
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { spaceId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const { currentVenue: relatedVenue, parentVenue } = useRelatedVenues({
    currentVenueId: spaceId,
  });

  const currentVenue = relatedVenue;

  const { push: openUrlUsingRouter } = useHistory();

  const { openUserProfileModal } = useProfileModalControls();

  const handleAvatarClick = useCallback(() => {
    openUserProfileModal(userWithId?.id);
  }, [openUserProfileModal, userWithId]);

  const navigateToHomepage = useCallback(() => {
    if (!relatedVenue) return;

    enterSpace(worldSlug, relatedVenue.slug, {
      customOpenRelativeUrl: openUrlUsingRouter,
    });
  }, [worldSlug, relatedVenue, openUrlUsingRouter]);

  const navbarTitle = title || (parentVenue?.name ?? currentVenue?.name);

  return (
    <>
      <header>
        <div className="navbar navbar_playa nonplaya">
          <div className="navbar-container">
            <div className="nav-logos">
              <div className="nav-sparkle-logo">
                <div />
              </div>
              <div
                className="nav-sparkle-logo_small"
                onClick={navigateToHomepage}
              >
                <div />
              </div>

              <div className="nav-location-title">Sparkle Admin</div>
              <div>{navbarTitle}</div>
            </div>

            {!withHiddenLoginButton && !user && <NavBarLogin />}

            {user && (
              <div className="navbar-links">
                <div
                  className="navbar-links-user-avatar"
                  onClick={handleAvatarClick}
                >
                  <UserAvatar user={userWithId} showStatus size="medium" />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* @debt Remove back button from Navbar */}
      {hasBackButton && currentVenue?.parentId && parentVenue?.name && (
        <BackButton variant="relative" space={parentVenue} />
      )}
    </>
  );
};
