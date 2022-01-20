import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { compose } from "lodash/fp";

import { AnalyticsCount as _AnalyticsCount } from "./AnalyticsCount";

export const AnalyticsCount = compose(withWorldOrSpace)(_AnalyticsCount);
