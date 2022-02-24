import { compose } from "lodash/fp";

import { withRequired } from "components/hocs/gate/withRequired";

import { RunTabUsers as _RunTabUsers } from "./RunTabUsers";

export const RunTabUsers = compose(withRequired(["space"]))(_RunTabUsers);
