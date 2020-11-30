import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";

import { PartyMapAdmin } from "../PartyMap/PartyMapAdmin";

import Camp from "./Camp";

export const CampRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();
  useConnectCurrentVenue();
  useConnectCurrentEvent();

  return (
    <Switch>
      <Route exact path={`${match.url}/admin`} component={PartyMapAdmin} />
      <Route path={`${match.url}/:roomTitle`} render={() => <Camp />} />
      <Route path={`${match.url}/`} render={() => <Camp />} />
    </Switch>
  );
};
