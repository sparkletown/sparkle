import { compose, get } from "lodash/fp";

import { ErrorReadingUsers } from "pages/Admin/VenueOwnersModal/ErrorReadingUsers";

import { withAllUsers } from "components/hocs/db/withAllUsers";
import { withErrorBoundary } from "components/hocs/gate/withErrorBoundary";
import { withFallback } from "components/hocs/gate/withFallback";
import { Loading } from "components/molecules/Loading";

import { VenueOwnersModal as _VenueOwnersModal } from "./VenueOwnersModal";

export const VenueOwnersModal = compose(
  withErrorBoundary(ErrorReadingUsers),
  withAllUsers,
  withFallback(
    (props) => !get("isLoadingUsers", props) && get("users", props)?.length > 0,
    Loading
  )
)(_VenueOwnersModal);
