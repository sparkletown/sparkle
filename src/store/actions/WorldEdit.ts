import { WorldGeneralFormInput } from "types/world";

import { WithOptionalWorldId } from "utils/id";

export const WORLD_EDIT: string = "WORLD_EDIT";

interface WorldEditAction {
  type: typeof WORLD_EDIT;
  payload?: WithOptionalWorldId<WorldGeneralFormInput>;
}

export const worldEdit = (
  payload?: WithOptionalWorldId<WorldGeneralFormInput>
) => ({
  type: WORLD_EDIT,
  payload,
});

export type WorldEditActions = WorldEditAction;
