import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Preplaya from ".";

export const PreplayaRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/:camp`} component={Preplaya} />
      <Route path={`${match.url}/`} component={Preplaya} />
    </Switch>
  );
};
