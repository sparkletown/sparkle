import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withTap } from "components/hocs/utility/withTap";
import { AnalyticsCheck as _AnalyticsCheck } from "core/AnalyticsCheck/AnalyticsCheck";
import { compose } from "lodash/fp";

export const AnalyticsCheck = compose(
  withAuth,
  withSlugs,
  withTap((ctx) => console.log("TAP", ctx.props))
)(_AnalyticsCheck);
