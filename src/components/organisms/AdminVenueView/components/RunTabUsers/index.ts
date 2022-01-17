import { withRequired } from "components/hocs/withRequired";
import { withSpaceById } from "components/hocs/withSpaceById";
import { compose } from "lodash/fp";

import { RunTabUsers as _RunTabUsers } from "./RunTabUsers";

export const RunTabUsers = compose(
  withRequired(["spaceId"]),
  withSpaceById,
  withRequired(["space"])
)(_RunTabUsers);
