import React, { useEffect } from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import { SET_FORM_VALUES } from "../redux";
import { setBannerURL, setSquareLogoUrl } from "../redux/actions";

import { VenueWizardEditProps } from "./VenueWizardEdit.types";

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({
  venueId,
  state,
  dispatch,
}) => {
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  useEffect(() => {
    dispatch({
      type: SET_FORM_VALUES,
      payload: {
        name: venue?.name,
        subtitle: venue?.config?.landingPageConfig?.subtitle,
        description: venue?.config?.landingPageConfig?.description,
        showGrid: venue?.showGrid,
        columns: venue?.columns,
        worldId: venue?.worldId,
      },
    });
    setBannerURL(
      dispatch,
      venue?.config?.landingPageConfig?.coverImageUrl ?? ""
    );
    setSquareLogoUrl(dispatch, venue?.host?.icon ?? "");
  }, [
    dispatch,
    venue?.columns,
    venue?.config?.landingPageConfig?.coverImageUrl,
    venue?.config?.landingPageConfig?.description,
    venue?.config?.landingPageConfig?.subtitle,
    venue?.host?.icon,
    venue?.name,
    venue?.showGrid,
    venue?.worldId,
  ]);

  return <SpaceEditorStartPanel data={state} dispatch={dispatch} />;
};

export default VenueWizardEdit;
