import { withAuth } from "components/hocs/db/withAuth";
import { compose } from "lodash/fp";

import { WorldsDashboard as _WorldsDashboard } from "./WorldsDashboard";

export const WorldsDashboard = compose(withAuth)(_WorldsDashboard);
