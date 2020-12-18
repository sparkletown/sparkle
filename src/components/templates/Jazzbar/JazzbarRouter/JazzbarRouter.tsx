import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import JazzBar from "../Jazzbar";
import ReactionPage from "pages/ReactionPage";
import VideoAdmin from "pages/VideoAdmin";

export const JazzbarRouter: React.FC = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/band`} component={ReactionPage} />
      <Route path={`${match.url}/admin`} component={VideoAdmin} />
      <Route path={`${match.url}/`} component={JazzBar} />
    </Switch>
  );
};

/**
 * @deprecated use named export instead
 */
export default JazzbarRouter;
