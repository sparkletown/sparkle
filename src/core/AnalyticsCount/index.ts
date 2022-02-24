import { compose } from "lodash/fp";

import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withChildren } from "components/hocs/gate/withChildren";

import {
  AnalyticsCount as _AnalyticsCount,
  AnalyticsCountProps,
} from "./AnalyticsCount";

export const AnalyticsCount = compose(
  withWorldOrSpace,
  withChildren<AnalyticsCountProps>(["space"])
)(_AnalyticsCount);
