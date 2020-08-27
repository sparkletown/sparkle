import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Camp from "./Camp";

export const CampRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/:roomTitle`} render={() => <Camp />} />
      <Route path={`${match.url}/`} render={() => <Camp />} />
    </Switch>
  );
};
