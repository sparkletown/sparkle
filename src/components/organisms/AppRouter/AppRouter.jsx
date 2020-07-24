import React, { useEffect } from "react";
import Register from "pages/Account/Register";
import Profile from "pages/Account/Profile";
import Questions from "pages/Account/Questions";
import CodeOfConduct from "pages/Account/CodeOfConduct";
import Login from "pages/Account/Login";
import App from "App";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import { setUser } from "actions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SparkleSpaceMarketingPage from "pages/SparkleSpaceMarketingPage";
import "firebase/analytics";

const AppRouter = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const analytics = firebase.analytics();
  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  // REVISIT: properly wrap dependencies in useRef per https://github.com/facebook/create-react-app/issues/6880
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickWindow = (event) => {
    event.target.id &&
      user &&
      analytics.logEvent("clickonbutton", {
        buttonId: event.target.id,
        userId: user.uid,
      });
  };

  useEffect(() => {
    window.addEventListener("click", onClickWindow, false);
    return () => {
      window.removeEventListener("click", onClickWindow, false);
    };
  });

  return (
    <Router basename="/">
      <Switch>
        <Route path="/SparkleVerse" component={SparkleSpaceMarketingPage} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/questions" component={Questions} />
        <Route path="/account/code-of-conduct" component={CodeOfConduct} />
        <Route path="/login" component={Login} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
