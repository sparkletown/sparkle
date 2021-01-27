import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import { ConversationSpace } from "./ConversationSpace";

export const ConversationSpaceRouter: React.FunctionComponent = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}`} component={ConversationSpace} />
    </Switch>
  );
};

/**
 * @deprecated use named export instead
 */
export default ConversationSpaceRouter;
