import { compose } from "lodash/fp";

import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";

import { WithNavigationBar as _WithNavigationBar } from "./WithNavigationBar";

export const WithNavigationBar = compose(withWorldOrSpace)(_WithNavigationBar);
