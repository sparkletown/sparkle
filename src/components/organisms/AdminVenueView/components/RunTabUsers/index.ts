import { withSpaceById } from "components/hocs/db/withSpaceById";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { RunTabUsers as _RunTabUsers } from "./RunTabUsers";

export const RunTabUsers = compose(
  withRequired(["spaceId"]),
  withSpaceById,
  withRequired(["space"])
)(_RunTabUsers);
