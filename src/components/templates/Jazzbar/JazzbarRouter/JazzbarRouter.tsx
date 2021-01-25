import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import JazzBar from "../Jazzbar";
import ReactionPage from "pages/ReactionPage";
import VideoAdmin from "pages/VideoAdmin";

export const JazzbarRouter: React.FC = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/band`} component={ReactionPage} />
      <Route path={`${match.path}/admin`} component={VideoAdmin} />
      <Route path={`${match.path}/`} component={JazzBar} />
    </Switch>
  );
};

/**
 * @deprecated use named export instead
 */
export default JazzbarRouter;
