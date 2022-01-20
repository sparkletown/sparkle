import { withSlugs } from "components/hocs/context/withSlugs";
import { withUserNG } from "components/hocs/db/withUserNG";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { AnalyticsCheck as _AnalyticsCheck } from "core/AnalyticsCheck/AnalyticsCheck";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

// export const AnalyticsCheck = compose(
//   withAuth,
//   withProfile,
//   withSlugs,
//   withFallback(
//     ({ spaceSlug, worldSlug }) => worldSlug && spaceSlug,
//     LoadingPage
//   ),
//   withWorldAndSpace,
//   withFetch
// )(_AnalyticsCheck);

export const AnalyticsCheck = compose(
  withUserNG,
  withFallback(
    (props: { isUserNGLoaded: boolean }) => props.isUserNGLoaded,
    LoadingPage
  ),
  withSlugs,
  withWorldOrSpace
  // withTap(({ component: { displayName, name }, props }) =>
  //   console.log("TAP", displayName ?? name, props)
  // )
)(_AnalyticsCheck);
