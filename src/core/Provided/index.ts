import { withSlugs } from "components/hocs/context/withSlugs";
import { compose } from "lodash/fp";

import { Provided as _Provided } from "./Provided";

export const Provided = compose(withSlugs)(_Provided);
