import { compose } from "lodash/fp";

import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withChildren } from "components/hocs/gate/withChildren";

import { NavBar as _NavBar } from "./NavBar";

export const NavBar = compose(
  withAuth,
  withChildren(["auth"]),
  withProfile,
  withChildren(["profile"]),
  withWorldOrSpace,
  withChildren(["userWithId"])
)(_NavBar);
