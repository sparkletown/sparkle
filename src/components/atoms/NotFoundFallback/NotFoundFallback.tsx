import React from "react";

import { NotFound } from "components/atoms/NotFound";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

export const NotFoundFallback: React.FC = () => (
  <WithNavigationBar hasBackButton withHiddenLoginButton withRadio>
    <NotFound />
  </WithNavigationBar>
);
