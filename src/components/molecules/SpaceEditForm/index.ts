import { withUser } from "components/hocs/withUser";

import { SpaceEditForm as _SpaceEditForm } from "./SpaceEditForm";

export const SpaceEditForm = withUser(_SpaceEditForm);
