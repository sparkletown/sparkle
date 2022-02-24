import { compose } from "lodash/fp";

import { withRequired } from "components/hocs/gate/withRequired";
import { withMemo } from "components/hocs/utility/withMemo";

import { VenueChat as _VenueChat } from "./VenueChat";
import { withMessages } from "./withMessages";

export const VenueChat = compose(
  withRequired(["space"]),
  withMessages,
  withMemo
)(_VenueChat);
