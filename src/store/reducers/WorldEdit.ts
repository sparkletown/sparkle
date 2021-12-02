import { WorldGeneralFormInput } from "types/world";

import { WithOptionalWorldId } from "utils/id";

import { WORLD_EDIT, WorldEditActions } from "../actions/WorldEdit";

export const worldEditStartValuesReducer: (
  state: Partial<WithOptionalWorldId<WorldGeneralFormInput>>,
  action: WorldEditActions
) => Partial<WithOptionalWorldId<WorldGeneralFormInput>> = (
  state = {},
  action
) => (action.type === WORLD_EDIT ? { ...action.payload } : state);
