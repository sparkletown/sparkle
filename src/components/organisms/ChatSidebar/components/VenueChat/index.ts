import { withSlugs } from "components/hocs/context/withSlugs";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { withMemo } from "components/hocs/utility/withMemo";
import { compose } from "lodash/fp";

import { VenueChat as _VenueChat } from "./VenueChat";
import { withMessages } from "./withMessages";

export const VenueChat = compose(
  withSlugs,
  withWorldAndSpace,
  withMessages,
  withMemo
)(_VenueChat);
