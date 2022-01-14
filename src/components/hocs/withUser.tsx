import React from "react";
import { withAuth } from "components/hocs/withAuth";
import { withRequired } from "components/hocs/withRequired";
import { compose } from "lodash/fp";

import { withProfile } from "./withProfile";

export const withUser = compose(withAuth, withRequired(["auth"]), withProfile);
