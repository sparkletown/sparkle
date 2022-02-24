import { compose } from "lodash/fp";

import { useAdminRole } from "hooks/user/useAdminRole";

import { AdminRestrictedLoading } from "components/atoms/AdminRestricted/AdminRestrictedLoading";
import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withHook } from "components/hocs/db/withHook";
import { withChildren } from "components/hocs/gate/withChildren";
import { withFallback } from "components/hocs/gate/withFallback";

import { AdminRestricted as _AdminRestricted } from "./AdminRestricted";

export const AdminRestricted = compose(
  withSlugs,
  withAuth,
  withFallback(["isAuthLoaded"], AdminRestrictedLoading),
  withFallback(["userId"], _AdminRestricted),
  withHook("AdminRole", useAdminRole),
  withFallback(["isAdminRoleLoaded"], AdminRestrictedLoading),
  withChildren(["isNotAdminUser"])
)(_AdminRestricted);
