import { withAllUsers } from "components/hocs/db/withAllUsers";
import { withFallback } from "components/hocs/gate/withFallback";
import { compose, get } from "lodash/fp";

import { Loading } from "components/molecules/Loading";

import { VenueOwnersModal as _VenueOwnersModal } from "./VenueOwnersModal";

export const VenueOwnersModal = compose(
  withAllUsers,
  withFallback(
    (props) => !get("isLoadingUsers", props) && get("users", props)?.length > 0,
    Loading
  )
)(_VenueOwnersModal);
