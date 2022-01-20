import { withSlugs } from "components/hocs/context/withSlugs";
import { withUser } from "components/hocs/db/withUser";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { withWorldBySlug } from "components/hocs/db/withWorldBySlug";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { NavBar as _NavBar } from "./NavBar";

export const NavBar = compose(
  withUser,
  withSlugs,
  withWorldAndSpace,
  withWorldBySlug,
  withRequired(["profile", "userWithId"])
)(_NavBar);
