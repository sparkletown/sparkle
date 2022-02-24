import { AnalyticsCheck as _AnalyticsCheck } from "core/AnalyticsCheck/AnalyticsCheck";
import { compose, get } from "lodash/fp";

import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withChildren } from "components/hocs/gate/withChildren";
import { withFallback } from "components/hocs/gate/withFallback";
import { LoadingPage } from "components/molecules/LoadingPage";

export const AnalyticsCheck = compose(
  withSlugs,
  withAuth,
  withFallback((props) => get("isAuthLoaded", props), LoadingPage),
  withChildren(["userId"])
)(_AnalyticsCheck);
