import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Camp from "./Camp";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";

export const CampRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();
  useConnectCurrentEvent();

  return (
    <Switch>
      <Route path={`${match.path}/:roomTitle`} component={Camp} />
      <Route path={`${match.path}/`} component={Camp} />
    </Switch>
  );
};
