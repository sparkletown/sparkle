import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { Page } from "./Page";

export const WalkerRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/`} component={Page} />
    </Switch>
  );
};
