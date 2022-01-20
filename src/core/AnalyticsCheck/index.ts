import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { AnalyticsCheck as _AnalyticsCheck } from "core/AnalyticsCheck/AnalyticsCheck";
import { compose } from "lodash/fp";

export const AnalyticsCheck = compose(withAuth, withSlugs)(_AnalyticsCheck);
