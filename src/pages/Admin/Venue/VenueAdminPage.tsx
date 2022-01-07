import React from "react";

import { DEFAULT_MAP_BACKGROUND, IFRAME_TEMPLATES } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useValidImage } from "hooks/useCheckImage";
import { useIsUserVenueOwner } from "hooks/useIsUserVenueOwner";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { BannerAdmin } from "components/organisms/BannerAdmin";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { AnnouncementMessage } from "components/molecules/AnnouncementMessage";
import { IframeAdmin } from "components/molecules/IframeAdmin";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AnnouncementOptions } from "./AnnouncementOptions";

import "./VenueAdminPage.scss";

export const VenueAdminPage: React.FC = () => {
  const { profile, user } = useUser();

  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space, spaceId, isLoaded } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

  const {
    isShown: isBannerAdminVisibile,
    show: showBannerAdmin,
    hide: hideBannerAdmin,
  } = useShowHide();
  const isVenueOwner = useIsUserVenueOwner();
  const isLoggedIn = profile && user;
  const isVenueLoading = !isLoaded;

  // TODO-redesign - Use this or delete it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapBackground] = useValidImage(
    space?.mapBackgroundImageUrl,
    DEFAULT_MAP_BACKGROUND
  );

  if (isVenueLoading) {
    return <LoadingPage />;
  }

  if (!isLoggedIn) {
    return <div className="admin-page-title">You need to log in first.</div>;
  }

  if (!space) {
    return <div className="admin-page-title">This space does not exist</div>;
  }

  if (!isVenueOwner) {
    return (
      <div className="admin-page-title">{`You don't have the permissions to access this page`}</div>
    );
  }

  const isIframeVenue = IFRAME_TEMPLATES.includes(space.template);

  return (
    <WithNavigationBar>
      <div className="VenueAdminPage">
        <h4 className="VenueAdminPage__title">
          Current Announcement in {space?.name}
        </h4>
        <div>
          <AnnouncementMessage />
        </div>
      </div>
      <div className="VenueAdminPage__settings">
        {isBannerAdminVisibile && (
          <BannerAdmin
            venueId={spaceId}
            venue={space}
            onClose={hideBannerAdmin}
          />
        )}

        {!isBannerAdminVisibile && (
          <>
            <AnnouncementOptions
              banner={space.banner}
              onEdit={showBannerAdmin}
            />
          </>
        )}
      </div>
      {isIframeVenue && <IframeAdmin venueId={spaceId} venue={space} />}
    </WithNavigationBar>
  );
};
