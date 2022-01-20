import { withSlugs } from "components/hocs/context/withSlugs";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { compose } from "lodash/fp";

import { VenuePage as _VenuePage } from "./VenuePage";

export const VenuePage = compose(withSlugs, withWorldOrSpace)(_VenuePage);
