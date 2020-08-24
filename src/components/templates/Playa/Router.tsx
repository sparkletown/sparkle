import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Playa from ".";

export const PlayaRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/:camp`} component={Playa} />
      <Route path={`${match.url}/`} component={Playa} />
    </Switch>
  );
};
