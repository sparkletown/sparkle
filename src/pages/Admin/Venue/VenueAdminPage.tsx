import React from "react";

import {
  isCurrentVenueNGRequestedSelector,
  isCurrentVenueNGRequestingSelector,
} from "utils/selectors";

import { IFRAME_TEMPLATES } from "settings";

import { useSelector } from "hooks/useSelector";
import { useIsUserVenueOwner } from "hooks/useIsUserVenueOwner";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { LoadingPage } from "components/molecules/LoadingPage";
import { AdminVideo } from "components/molecules/AdminVideo";
import { BannerAdmin } from "components/organisms/BannerAdmin";

import "./VenueAdminPage.scss";

export const VenueAdminPage: React.FC = () => {
  const { profile, user } = useUser();
  const venueId = useVenueId();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);
  const venueRequestStatus = useSelector(isCurrentVenueNGRequestedSelector);
  const venueRequestingStatus = useSelector(isCurrentVenueNGRequestingSelector);

  const isVenueOwner = useIsUserVenueOwner();
  const isVenueLoading = venueRequestingStatus || !venueRequestStatus;
  const isLoggedIn = profile && user;

  if (isVenueLoading) {
    return <LoadingPage />;
  }

  if (!isLoggedIn) {
    return <div className="admin-page-title">You need to log in first.</div>;
  }

  if (!venue) {
    return <div className="admin-page-title">This venue does not exist</div>;
  }

  if (!isVenueOwner) {
    return (
      <div className="admin-page-title">{`You don't have the permissions to access this page`}</div>
    );
  }

  const isVideoVenue = IFRAME_TEMPLATES.includes(venue.template);

  return (
    <>
      <h4 className="admin-page-title">You are editing venue: {venue.name}</h4>
      <BannerAdmin venueId={venueId} venue={venue} />
      {isVideoVenue && <AdminVideo venueId={venueId} venue={venue} />}
    </>
  );
};
