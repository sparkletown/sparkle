import React, { FC } from "react";

import {
  isCurrentVenueRequestedSelector,
  isCurrentVenueRequestingSelector,
  venueSelector,
} from "utils/selectors";

import { IFRAME_TEMPLATES } from "settings";

import { useSelector } from "hooks/useSelector";
import { useUserIsVenueOwner } from "hooks/useUserIsVenueOwner";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useUser } from "hooks/useUser";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import { AdminVideo } from "components/molecules/AdminVideo";
import { AdminBanner } from "components/molecules/AdminBanner/AdminBanner";

import "./VenueAdminPage.scss";

export const VenueAdminPage: FC = () => {
  useConnectCurrentVenue();

  const { profile, user } = useUser();
  const venue = useSelector(venueSelector);
  const venueRequestStatus = useSelector(isCurrentVenueRequestedSelector);
  const venueRequestingStatus = useSelector(isCurrentVenueRequestingSelector);

  const isVenueOwner = useUserIsVenueOwner();
  const isLoadingVenue = venueRequestingStatus || !venueRequestStatus;
  const isLoggedIn = profile && user;

  if (isLoadingVenue) {
    return <LoadingPage />;
  }

  if (!venue) {
    return <div className="admin-page-title">This venue does not exist</div>;
  }

  if (!isLoggedIn) {
    return <div className="admin-page-title">You need to log in first.</div>;
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
      <AdminBanner />
      {isVideoVenue && <AdminVideo />}
    </>
  );
};
