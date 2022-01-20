import { withSlugs } from "components/hocs/context/withSlugs";
import { withUser } from "components/hocs/db/withUser";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { NavBar as _NavBar } from "./NavBar";

export const NavBar = compose(
  withUser,
  withSlugs,
  withWorldOrSpace,
  withRequired(["profile", "userWithId"])
)(_NavBar);
