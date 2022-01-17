import { withFragment } from "components/hocs/withFragment";
import { AnalyticsCheck } from "core/AnalyticsCheck";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

export const AnalyticsFree = withFragment<{ space?: WithId<AnyVenue> }>(
  ({ space }) => space
)(AnalyticsCheck);
