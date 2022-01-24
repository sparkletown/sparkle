import React from "react";

import { SpaceId } from "types/id";

import Login from "pages/Account/Login";

type Props = { spaceId: SpaceId };

export const NotLoggedInFallback: React.FC<Props> = ({ spaceId }) => (
  <Login spaceId={spaceId} />
);
