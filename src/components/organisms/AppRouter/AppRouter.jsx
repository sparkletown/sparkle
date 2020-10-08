import React, { useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "firebase/analytics";

import SplashPage from "pages/Account/SplashPage";
import Step1 from "pages/Account/Step1";
import Step2 from "pages/Account/Step2";
import Step3 from "pages/Account/Step3";
import Step4 from "pages/Account/Step4";
import Step5 from "pages/Account/Step5";
import Step6a from "pages/Account/Step6a";
import Step6b from "pages/Account/Step6b";
import Profile from "pages/Account/Profile";
import Questions from "pages/Account/Questions";
import CodeOfConduct from "pages/Account/CodeOfConduct";
import Login from "pages/Account/Login";
import Admin from "pages/Admin/Admin";
import { VenueLandingPage } from "pages/VenueLandingPage";
import { VenueEntrancePage } from "pages/VenueEntrancePage";
import { leaveRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";
import { SPARKLEVERSE_MARKETING_URL } from "settings";

import VenuePage from "pages/VenuePage";
import { venueLandingUrl } from "utils/url";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { SchedulePage } from "pages/Schedule/SchedulePage";

const STORAGE_TABS_KEY = "TABS_OPEN";

const AppRouter = ({ defaultRedirect }) => {
  const firebase = useFirebase();
  const analytics = firebase.analytics();
  const { user } = useUser();

  useEffect(() => {
    const onClickWindow = (event) => {
      event.target.id &&
        user &&
        analytics.logEvent("clickonbutton", {
          buttonId: event.target.id,
          userId: user.uid,
        });
    };

    let tabCount = localStorage.getItem(STORAGE_TABS_KEY)
      ? parseInt(localStorage.getItem(STORAGE_TABS_KEY))
      : 0;

    localStorage.setItem(STORAGE_TABS_KEY, tabCount + 1);

    const leaveRoomBeforeUnload = () => {
      tabCount = parseInt(localStorage.getItem(STORAGE_TABS_KEY));
      localStorage.setItem(STORAGE_TABS_KEY, tabCount > 0 ? tabCount - 1 : 0);

      tabCount = parseInt(localStorage.getItem(STORAGE_TABS_KEY));

      if (user && !tabCount) {
        leaveRoom(user);
      }
    };
    window.addEventListener("click", onClickWindow, false);
    window.addEventListener("beforeunload", leaveRoomBeforeUnload, false);
    return () => {
      window.removeEventListener("click", onClickWindow, false);
      window.removeEventListener("beforeunload", leaveRoomBeforeUnload, false);
    };
  }, [user, analytics]);

  return (
    <Router basename="/">
      <Switch>
        <Route
          path="/SparkleVerse"
          component={() => <Redirect to={SPARKLEVERSE_MARKETING_URL} />}
        />
        <Route path="/enter/step1" component={Step1} />
        <Route path="/enter/step2" component={Step2} />
        <Route path="/enter/step3" component={Step3} />
        <Route path="/enter/step4" component={Step4} />
        <Route path="/enter/step5" component={Step5} />
        <Route path="/enter/step6a" component={Step6a} />
        <Route path="/enter/step6b" component={Step6b} />
        <Route path="/enter" component={SplashPage} />
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/questions" component={Questions} />
        <Route path="/account/code-of-conduct" component={CodeOfConduct} />
        <Route path="/login" component={Login} />
        <Route path="/admin/venue/rooms/:venueId" component={RoomsForm} />
        <Route path="/admin/venue/creation" component={VenueWizard} />
        <Route path="/admin/venue/edit/:venueId" component={VenueWizard} />
        <Route path="/admin/venue/:venueId" component={Admin} />
        <Route path="/admin" component={Admin} />
        <Route path="/v/:venueId" component={VenueLandingPage} />
        <Route path="/e/:step/:venueId" component={VenueEntrancePage} />
        <Route path="/in/:venueId" component={VenuePage} />
        <Route path="/playa/schedule" component={SchedulePage} />
        <Route
          path="/venue/*"
          render={(props) => (
            <Redirect to={venueLandingUrl(props.match.params[0])} />
          )}
        />
        <Route path="/" component={() => <Redirect to={defaultRedirect} />} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
