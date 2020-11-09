import React, { useCallback, useEffect } from "react";

// Components
import Details from "pages/Admin/Details";

// Hooks
import { useFirestore } from "react-redux-firebase";

// Typings
import { VenueNew } from "types/Venue";
import { VenueWizardEditProps } from "./VenueWizardEdit.types";
import { setBannerURL, setSquareLogoUrl } from "../redux/actions";
import { SET_FORM_VALUES } from "../redux";

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({
  venueId,
  state,
  dispatch,
}) => {
  // get the venue
  const firestore = useFirestore();

  const fetchVenueFromAPI = useCallback(async () => {
    const venueSnapshot = await firestore
      .collection("venues")
      .doc(venueId)
      .get();

    if (!venueSnapshot.exists) return;
    const data = venueSnapshot.data() as VenueNew;
    dispatch({
      type: SET_FORM_VALUES,
      payload: {
        name: data.name,
        subtitle: data.config.landingPageConfig.subtitle,
        description: data.config.landingPageConfig.description,
      },
    });
    setBannerURL(dispatch, data.config.landingPageConfig.coverImageUrl);
    setSquareLogoUrl(dispatch, data.host.icon);
  }, [dispatch, firestore, venueId]);

  useEffect(() => {
    fetchVenueFromAPI();
  }, [dispatch, fetchVenueFromAPI, firestore, venueId]);

  const editData = {
    bannerImageUrl: state.bannerURL,
    logoImageUrl: state.squareLogoURL,
    name: state.formValues?.name,
    description: state.formValues?.description,
    subtitle: state.formValues?.subtitle,
  };

  return <Details venueId={venueId} editData={editData} dispatch={dispatch} />;
};

export default VenueWizardEdit;
