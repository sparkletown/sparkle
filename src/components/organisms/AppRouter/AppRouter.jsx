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
import Admin from "pages/Admin/Admin";
import { VenueLandingPage } from "pages/VenueLandingPage";

import { leaveRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";
import { SPARKLEVERSE_MARKETING_URL } from "settings";

import VenuePage from "pages/VenuePage";
import { venueLandingUrl } from "utils/url";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";

const AppRouter = ({ defaultRedirect }) => {
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
        <Route
          path="/SparkleVerse"
          component={() => <Redirect to={SPARKLEVERSE_MARKETING_URL} />}
        />
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
        <Route path="/in/:venueId" component={VenuePage} />
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
