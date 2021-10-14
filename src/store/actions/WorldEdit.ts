import { WorldStartFormInput } from "types/world";

import { WithOptionalWorldId } from "utils/id";

export const WORLD_EDIT: string = "WORLD_EDIT";

interface WorldEditAction {
  type: typeof WORLD_EDIT;
  payload?: WithOptionalWorldId<WorldStartFormInput>;
}

export const worldEdit = (
  payload?: WithOptionalWorldId<WorldStartFormInput>
) => ({
  type: WORLD_EDIT,
  payload,
});

export type WorldEditActions = WorldEditAction;
