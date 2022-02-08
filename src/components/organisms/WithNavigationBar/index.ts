import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { compose } from "lodash/fp";

import { WithNavigationBar as _WithNavigationBar } from "./WithNavigationBar";

export const WithNavigationBar = compose(withWorldOrSpace)(_WithNavigationBar);
