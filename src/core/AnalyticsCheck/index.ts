import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { AnalyticsCheck as _AnalyticsCheck } from "core/AnalyticsCheck/AnalyticsCheck";
import { withFetch } from "core/AnalyticsCheck/withFetch";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

export const AnalyticsCheck = compose(
  withAuth,
  withProfile,
  withSlugs,
  withFallback(
    ({ spaceSlug, worldSlug }) => worldSlug && spaceSlug,
    LoadingPage
  ),
  withWorldAndSpace,
  withFetch
)(_AnalyticsCheck);
