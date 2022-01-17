import { withRequired } from "components/hocs/withRequired";
import { withSlugs } from "components/hocs/withSlugs";
import { withUser } from "components/hocs/withUser";
import { withWorld } from "components/hocs/withWorld";
import { withWorldAndSpace } from "components/hocs/withWorldAndSpace";
import { compose } from "lodash/fp";

import { NavBar as _NavBar } from "./NavBar";

export const NavBar = compose(
  withUser,
  withSlugs,
  withWorldAndSpace,
  withWorld,
  withRequired(["profile", "userWithId"])
)(_NavBar);
