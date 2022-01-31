import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { compose } from "lodash/fp";

import { WithAdminNavBar as _WithAdminNavBar } from "./WithAdminNavBar";

export const WithAdminNavBar = compose(withWorldOrSpace)(_WithAdminNavBar);
