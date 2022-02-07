import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { RunTabUsers as _RunTabUsers } from "./RunTabUsers";

export const RunTabUsers = compose(withRequired(["space"]))(_RunTabUsers);
