import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Profile from "pages/Account/Profile";
import Questions from "pages/Account/Questions";
import CodeOfConduct from "pages/Account/CodeOfConduct";
import { LoginWithCustomToken } from "pages/Account/LoginWithCustomToken";
import Admin from "pages/Admin/Admin";
import Admin_v2 from "pages/Admin/Admin_v2";

import { VenueLandingPage } from "pages/VenueLandingPage";
import { VenueEntrancePage } from "pages/VenueEntrancePage";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";
import VenueWizard_v2 from "pages/Admin/Venue/VenueWizard/VenueWizard";

import { VersionPage } from "pages/VersionPage/VersionPage";
import { DEFAULT_REDIRECT_URL, SPARKLEVERSE_HOMEPAGE_URL } from "settings";

import VenuePage from "pages/VenuePage";
import { venueLandingUrl } from "utils/url";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";
import { AdminVenueView } from "components/organisms/AdminVenueView";

import { EnterSubrouter } from "./EnterSubrouter";

const AppRouter: React.FC = () => {
  return (
    <Router basename="/">
      <Switch>
        <Route
          path="/SparkleVerse"
          component={() => <Redirect to={SPARKLEVERSE_HOMEPAGE_URL} />}
        />
        <Route path="/enter" component={EnterSubrouter} />
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/questions" component={Questions} />
        <Route path="/account/code-of-conduct" component={CodeOfConduct} />
        <Route
          path="/login/:venueId/:customToken"
          component={LoginWithCustomToken}
        />
        {/* @debt The /login route doesn't work since we added non-defaulted props to the Login component */}
        {/*<Route path="/login" component={Login} />*/}
        <Route path="/admin/venue/rooms/:venueId" component={RoomsForm} />

        <Route path="/admin/venue/creation" component={VenueWizard} />
        <Route path="/admin/venue/edit/:venueId" component={VenueWizard} />

        <Route path="/admin-ng/venue/:venueId?" component={AdminVenueView} />
        <Route
          path="/admin-ng/advanced-settings/:venueId?"
          component={AdminAdvancedSettings}
        />

        <Route path="/admin-ng/venue/creation" component={VenueWizard_v2} />
        <Route path="/admin-ng/edit/:venueId" component={VenueWizard_v2} />

        <Route path="/admin/:venueId" component={Admin} />

        <Route path="/admin" component={Admin} />
        <Route path="/admin-ng" component={Admin_v2} />

        <Route path="/v/:venueId" component={VenueLandingPage} />
        <Route path="/e/:step/:venueId" component={VenueEntrancePage} />
        <Route path="/in/:venueId/admin" component={VenueAdminPage} />
        <Route path="/in/:venueId" component={VenuePage} />
        <Route path="/version" component={VersionPage} />
        <Route
          path="/venue/*"
          render={(props) => (
            <Redirect to={venueLandingUrl(props.match.params[0])} />
          )}
        />
        <Route
          path="/"
          component={() => {
            window.location.href = DEFAULT_REDIRECT_URL;
            return null;
          }}
        />
      </Switch>
    </Router>
  );
};

export default AppRouter;
