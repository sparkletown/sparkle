import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { SpaceUsersManager as _SpaceUsersManager } from "./SpaceUsersManager";

export const SpaceUsersManager = compose(withRequired(["space"]))(
  _SpaceUsersManager
);
