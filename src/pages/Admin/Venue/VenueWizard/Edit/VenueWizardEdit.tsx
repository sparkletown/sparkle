import React, { useEffect } from "react";

// Components
import Details from "pages/Admin/Details";

// Hooks
import { useFirestore } from "react-redux-firebase";

// Utils | Settings | Constants | Helpers
import { ALL_VENUE_TEMPLATES } from "settings";

// Typings
import { Venue } from "types/Venue";
import { VenueWizardEditProps } from "./VenueWizardEdit.types";
import { submitTemplatePage } from "../redux/actions";
import { SET_FORM_VALUES } from "../redux";

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({
  venueId,
  state,
  dispatch,
}) => {
  // get the venue
  const firestore = useFirestore();

  useEffect(() => {
    const fetchVenueFromAPI = async () => {
      const venueSnapshot = await firestore
        .collection("venues")
        .doc(venueId)
        .get();
      if (!venueSnapshot.exists) return;
      const data = venueSnapshot.data() as Venue;
      //find the template
      const template = ALL_VENUE_TEMPLATES.find(
        (template) => data.template === template.template
      );

      if (!template) return;

      // ensure reducer is synchronised with API data
      submitTemplatePage(dispatch, template);
      dispatch({
        type: SET_FORM_VALUES,
        payload: {
          name: data.name,
          subtitle: template?.subtitle,
          description: template.description[0],
        },
      });
    };
    fetchVenueFromAPI();
  }, [dispatch, firestore, venueId]);

  return <Details venueId={venueId} state={state} dispatch={dispatch} />;
};

export default VenueWizardEdit;
