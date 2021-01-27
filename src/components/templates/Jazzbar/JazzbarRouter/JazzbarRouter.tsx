import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import JazzBar from "../Jazzbar";
import ReactionPage from "pages/ReactionPage";

export const JazzbarRouter: React.FC = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/band`} component={ReactionPage} />
      <Route path={`${match.path}/`} component={JazzBar} />
    </Switch>
  );
};

/**
 * @deprecated use named export instead
 */
export default JazzbarRouter;
