import { withSlugs } from "components/hocs/context/withSlugs";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { compose } from "lodash/fp";

import { Provided as _Provided } from "./Provided";

export const Provided = compose(withSlugs, withWorldAndSpace)(_Provided);
