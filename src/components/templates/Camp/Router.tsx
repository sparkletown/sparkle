import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Camp from "./Camp";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import CampAdmin from "./CampAdmin";

export const CampRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();
  useConnectCurrentEvent();

  return (
    <Switch>
      <Route exact path={`${match.url}/admin`} component={CampAdmin} />
      <Route path={`${match.url}/:roomTitle`} render={() => <Camp />} />
      <Route path={`${match.url}/`} render={() => <Camp />} />
    </Switch>
  );
};
