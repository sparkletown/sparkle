import { withAuth } from "components/hocs/withAuth";
import { withFallback } from "components/hocs/withFallback";
import { withProfile } from "components/hocs/withProfile";
import { withSlugs } from "components/hocs/withSlugs";
import { withSpace } from "components/hocs/withSpace";
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
  withSpace,
  withFetch
)(_AnalyticsCheck);
