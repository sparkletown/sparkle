import { withAuth } from "components/hocs/withAuth";

import { SpacesDashboard as _SpacesDashboard } from "./SpacesDashboard";

export const SpacesDashboard = withAuth(_SpacesDashboard);
