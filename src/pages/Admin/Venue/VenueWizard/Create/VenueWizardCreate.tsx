import React, { useCallback } from 'react';

// Components
import AuthenticationModal from 'components/organisms/AuthenticationModal';
import WithNavigationBar from 'components/organisms/WithNavigationBar';

// Pages
import DetailsForm from 'pages/Admin/Details';

// Hooks
import { useHistory } from 'react-router-dom';
import { useUser } from 'hooks/useUser';

const VenueWizardCreate: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();

  const previous = useCallback(
    () => history.push(`${history.location.pathname}`),
    [history]
  );

  if (!user) {
    return (
      <WithNavigationBar fullscreen>
        <AuthenticationModal show={true} onHide={() => { }} showAuth="login" />
      </WithNavigationBar>
    );
  }

  // return (
  //   <WithNavigationBar fullscreen>
  //     <DetailsForm previous={previous} />
  //   </WithNavigationBar>
  // );
  return <DetailsForm previous={previous} />

};

export default VenueWizardCreate;
