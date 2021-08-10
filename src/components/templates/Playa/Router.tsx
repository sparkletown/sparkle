import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import Playa from ".";

export const PlayaRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route path={`${match.path}/:camp`} component={Playa} />
      <Route path={`${match.path}/`} component={Playa} />
    </Switch>
  );
};
