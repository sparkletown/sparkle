import { WorldStartFormInput } from "types/world";

import { WithOptionalWorldId } from "utils/id";

import { WORLD_EDIT, WorldEditActions } from "../actions/WorldEdit";

export const worldEditStartValuesReducer: (
  state: Partial<WithOptionalWorldId<WorldStartFormInput>>,
  action: WorldEditActions
) => Partial<WithOptionalWorldId<WorldStartFormInput>> = (state = {}, action) =>
  action.type === WORLD_EDIT ? { ...action.payload } : state;
