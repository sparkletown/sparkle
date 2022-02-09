import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { WithSlugsProps } from "components/hocs/context/withSlugs";
import { WithAuthProps } from "components/hocs/db/withAuth";
import { WithProfileProps } from "components/hocs/db/withProfile";
import { WithWorldOrSpaceProps } from "components/hocs/db/withWorldOrSpace";

import { enterSpace } from "utils/url";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { BackButton } from "components/atoms/BackButton";
import { UserAvatar } from "components/atoms/UserAvatar";

import { NavBarLogin } from "./components/NavBarLogin";

import "./AdminNavBar.scss";
import "./playa.scss";

type Props = WithAuthProps &
  WithProfileProps &
  WithSlugsProps &
  WithWorldOrSpaceProps & {
    hasBackButton?: boolean;
    withHiddenLoginButton?: boolean;
    title?: string;
  };

export const AdminNavBar: React.FC<Props> = ({
  hasBackButton,
  title,
  withHiddenLoginButton,
  auth,
  userWithId,
  worldSlug,
  spaceId,
}) => {
  const { currentVenue: relatedSpace, parentVenue: parentSpace } =
    useRelatedVenues({
      currentVenueId: spaceId,
    });

  const { push: openUrlUsingRouter } = useHistory();
  const { openUserProfileModal } = useProfileModalControls();

  const handleAvatarClick = useCallback(
    () => void openUserProfileModal(userWithId?.id),
    [openUserProfileModal, userWithId]
  );

  const navigateToHomepage = useCallback(() => {
    if (!relatedSpace) return;

    enterSpace(worldSlug, relatedSpace.slug, {
      customOpenRelativeUrl: openUrlUsingRouter,
    });
  }, [worldSlug, relatedSpace, openUrlUsingRouter]);

  const navbarTitle = title || (parentSpace?.name ?? relatedSpace?.name);

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

            {!withHiddenLoginButton && !auth && <NavBarLogin />}

            {auth && (
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
      {hasBackButton && relatedSpace?.parentId && parentSpace?.name && (
        <BackButton variant="relative" space={parentSpace} />
      )}
    </>
  );
};
