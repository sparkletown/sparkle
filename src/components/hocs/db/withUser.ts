import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

export const withUser = compose(withAuth, withRequired(["auth"]), withProfile);
