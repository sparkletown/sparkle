import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Camp from "./Camp";

export const CampRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/:roomTitle`} component={Camp} />
      <Route path={`${match.url}/`} component={Camp} />
    </Switch>
  );
};
