import React, { useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "firebase/analytics";

import Profile from "pages/Account/Profile";
import Questions from "pages/Account/Questions";
import CodeOfConduct from "pages/Account/CodeOfConduct";
import Login from "pages/Account/Login";
import Admin from "pages/Account/Admin";
import SparkleSpaceMarketingPage from "pages/SparkleSpaceMarketingPage";
import VenuePage from "pages/VenuePage";
import TemplateRouter from "components/organisms/TemplateRouter";

import { leaveRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { VenueWizard } from "pages/Account/Venue/VenueWizard";

const AppRouter = () => {
  const firebase = useFirebase();
  const analytics = firebase.analytics();
  const { user } = useUser();

  const onClickWindow = (event) => {
    event.target.id &&
      user &&
      analytics.logEvent("clickonbutton", {
        buttonId: event.target.id,
        userId: user.uid,
      });
  };

  const leaveRoomBeforeUnload = () => {
    if (user) {
      leaveRoom(user);
    }
  };

  useEffect(() => {
    window.addEventListener("click", onClickWindow, false);
    window.addEventListener("onbeforeunload", leaveRoomBeforeUnload, false);
    return () => {
      window.removeEventListener("click", onClickWindow, false);
      window.removeEventListener(
        "onbeforeunload",
        leaveRoomBeforeUnload,
        false
      );
    };
  });

  return (
    <Router basename="/">
      <Switch>
        <Route path="/SparkleVerse" component={SparkleSpaceMarketingPage} />
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/questions" component={Questions} />
        <Route path="/account/code-of-conduct" component={CodeOfConduct} />
        <Route path="/login" component={Login} />
        <Route path="/admin/venue/creation" component={VenueWizard} />
        <Route path="/admin/venue/:venueId" component={Admin} />
        <Route path="/admin" component={Admin} />
        <Route path="/v/:venueId/live" component={VenuePage} />
        <Route path="/v/:venueId" component={TemplateRouter} />
        <Route
          path="/venue/*"
          render={(props) => <Redirect to={`/v/${props.match.params[0]}`} />}
        />
        <Route path="/" component={() => <Redirect to="/v/kansassmittys" />} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
