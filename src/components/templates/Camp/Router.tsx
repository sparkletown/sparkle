import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import Camp, { CampProps } from "./Camp";

export const CampRouter: React.FunctionComponent<CampProps> = ({
  setLocationName,
}) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route
        path={`${match.url}/:roomTitle`}
        render={() => <Camp setLocationName={setLocationName} />}
      />
      <Route
        path={`${match.url}/`}
        render={() => <Camp setLocationName={setLocationName} />}
      />
    </Switch>
  );
};
