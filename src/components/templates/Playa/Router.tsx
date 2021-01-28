import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Playa from ".";
import PlayaAdmin from "./PlayaAdmin";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

export const PlayaRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();

  return (
    <Switch>
      <Route exact path={`${match.path}/admin`} component={PlayaAdmin} />
      <Route path={`${match.path}/:camp`} component={Playa} />
      <Route path={`${match.path}/`} component={Playa} />
    </Switch>
  );
};
