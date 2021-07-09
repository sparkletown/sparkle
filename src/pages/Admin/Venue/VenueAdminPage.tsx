import React from "react";

import {
  isCurrentVenueNGRequestedSelector,
  isCurrentVenueNGRequestingSelector,
} from "utils/selectors";

import { IFRAME_TEMPLATES } from "settings";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useIsUserVenueOwner } from "hooks/useIsUserVenueOwner";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { LoadingPage } from "components/molecules/LoadingPage";
import { IframeAdmin } from "components/molecules/IframeAdmin";
import { BannerAdmin } from "components/organisms/BannerAdmin";

import "./VenueAdminPage.scss";

const VenueAdminPageContents: React.FC = () => {
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

  const isIframeVenue = IFRAME_TEMPLATES.includes(venue.template);

  return (
    <>
      <h4 className="admin-page-title">You are editing venue: {venue.name}</h4>
      <BannerAdmin venueId={venueId} venue={venue} />
      {isIframeVenue && <IframeAdmin venueId={venueId} venue={venue} />}
    </>
  );
};

export const VenueAdminPage = () => {
  const venueId = useVenueId();
  return (
    <RelatedVenuesProvider venueId={venueId}>
      <VenueAdminPageContents />
    </RelatedVenuesProvider>
  );
};
