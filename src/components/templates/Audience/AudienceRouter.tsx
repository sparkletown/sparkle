import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import VideoAdmin from "pages/VideoAdmin";
import { Audience } from "./Audience";

export const AudienceRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/admin`} component={VideoAdmin} />
      <Route path={`${match.path}`} component={Audience} />
    </Switch>
  );
};

/**
 * @deprecated use named export instead
 */
export default AudienceRouter;
