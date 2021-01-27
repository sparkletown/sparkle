import React, { FC } from "react";

import { AdminBanner } from "components/molecules/AdminBanner/AdminBanner";
import { useUserIsVenueOwner } from "hooks/useUserIsVenueOwner";
import { IFRAME_TEMPLATES } from "settings";
import { AdminVideo } from "components/molecules/AdminVideo";
import { useVenueId } from "hooks/useVenueId";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import {
  isCurrentVenueRequestedSelector,
  venueSelector,
} from "utils/selectors";
import { useSelector } from "hooks/useSelector";

export const VenueAdminPage: FC = () => {
  useConnectCurrentVenue();

  const venueId = useVenueId();
  const venue = useSelector(venueSelector);
  const venueRequestStatus = useSelector(isCurrentVenueRequestedSelector);
  const isVenueOwner = useUserIsVenueOwner();
  const isExistingVenue = venueRequestStatus && venue;

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (!isExistingVenue) {
    return <>This venue does not exist</>;
  }

  if (!isVenueOwner) {
    return <>{`You don't have the permissions to access this page`}</>;
  }

  const isVideoVenue = IFRAME_TEMPLATES.includes(venue.template);

  return (
    <>
      <AdminBanner />
      {isVideoVenue && <AdminVideo />}
    </>
  );
};
