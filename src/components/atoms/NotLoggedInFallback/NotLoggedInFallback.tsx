import React, { lazy, Suspense } from "react";

import { SpaceId } from "types/id";

import { tracePromise } from "utils/performance";

import { LoadingPage } from "components/molecules/LoadingPage";

const Login = lazy(() =>
  tracePromise("VenuePage::lazy-import::Login", () =>
    import("pages/auth/Login").then(({ Login }) => ({
      default: Login,
    }))
  )
);

type Props = { spaceId: SpaceId };

export const NotLoggedInFallback: React.FC<Props> = () => (
  <Suspense fallback={<LoadingPage />}>
    <Login />
  </Suspense>
);
