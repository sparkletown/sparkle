import React, { lazy } from "react";

import { SpaceId } from "types/id";

import { tracePromise } from "utils/performance";

const Login = lazy(() =>
  tracePromise("VenuePage::lazy-import::Login", () =>
    import("pages/Account/Login").then(({ Login }) => ({
      default: Login,
    }))
  )
);

type Props = { spaceId: SpaceId };

export const NotLoggedInFallback: React.FC<Props> = ({ spaceId }) => (
  <Login spaceId={spaceId} />
);
