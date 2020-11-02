import React, { useEffect, useReducer } from 'react';

// Components
import Details from 'pages/Admin/Details';

// Hooks
import { useFirestore } from 'react-redux-firebase';

// Utils | Settings | Constants | Helpers
import { ALL_VENUE_TEMPLATES } from 'settings';

// Reducer
import { VenueWizardReducer, initialState } from '../redux/reducer';

// Typings
import { Venue } from 'types/Venue';
import { VenueWizardEditProps } from './VenueWizardEdit.types';
import { submitDetailsPage, submitTemplatePage } from '../redux/actions';


const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({ venueId }) => {
  // get the venue
  const firestore = useFirestore();
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);

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
      submitDetailsPage(dispatch, data);
    };
    fetchVenueFromAPI();
  }, [firestore, venueId]);

  if (!state.detailsPage) return <div>Loading...</div>;

  return <Details venueId={venueId} />;
};

export default VenueWizardEdit;
