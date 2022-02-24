import { compose } from "lodash/fp";

import { NotLoggedInFallback } from "components/atoms/NotLoggedInFallback";
import { withAuth } from "components/hocs/db/withAuth";
import { withFallback } from "components/hocs/gate/withFallback";
import { LoadingPage } from "components/molecules/LoadingPage";

import { WorldsDashboard as _WorldsDashboard } from "./WorldsDashboard";

export const WorldsDashboard = compose(
  withAuth,
  withFallback(["isAuthLoaded"], LoadingPage),
  withFallback(["userId"], NotLoggedInFallback)
)(_WorldsDashboard);
