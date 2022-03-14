import { withUserNG } from "components/hocs/db/withUserNG";
import { compose } from "redux";

import { AdminSidebarProfile as _AdminSidebarProfile } from "./AdminSidebarProfile";

export const AdminSidebarProfile = compose(withUserNG)(_AdminSidebarProfile);
