import { compose } from "redux";

import { withUserNG } from "components/hocs/db/withUserNG";

import { AdminSidebarProfile as _AdminSidebarProfile } from "./AdminSidebarProfile";

export const AdminSidebarProfile = compose(withUserNG)(_AdminSidebarProfile);
