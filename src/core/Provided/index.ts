import { withSlugs } from "components/hocs/context/withSlugs";
import { compose } from "lodash/fp";

import { Provided as _Provided } from "./Provided";

export const Provided = compose(
  withSlugs
  // withWorldOrSpace,
  // withTap(({ component: { displayName, name }, props }) =>
  //   console.log("TAP", displayName ?? name, props)
  // )
)(_Provided);
