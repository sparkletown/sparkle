import { withSlugs } from "components/hocs/context/withSlugs";
import { withUser } from "components/hocs/db/withUser";
import { withWorld } from "components/hocs/db/withWorld";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { NavBar as _NavBar } from "./NavBar";

export const NavBar = compose(
  withUser,
  withSlugs,
  withWorldAndSpace,
  withWorld,
  withRequired(["profile", "userWithId"])
)(_NavBar);
