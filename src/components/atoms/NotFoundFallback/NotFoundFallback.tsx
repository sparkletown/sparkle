import React from "react";

import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { NotFound } from "components/atoms/NotFound";

export const NotFoundFallback: React.FC = () => (
  <WithNavigationBar hasBackButton withHiddenLoginButton withRadio>
    <NotFound />
  </WithNavigationBar>
);
