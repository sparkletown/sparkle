import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withWorldOrSpace } from "components/hocs/db/withWorldOrSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose } from "lodash/fp";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminNavBar as _AdminNavBar } from "./AdminNavBar";

export const AdminNavBar = compose(
  withAuth,
  withFallback(["isAuthLoaded"], LoadingPage),
  withProfile,
  withFallback(["isProfileLoaded"], Loading),
  withWorldOrSpace,
  withFallback(["isProfileLoaded", "isSpacesLoaded"], Loading)
)(_AdminNavBar);
