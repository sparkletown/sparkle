import { spaceCreateItemReducer } from "store/reducers/SpaceEdit";
import { worldEditStartValuesReducer } from "store/reducers/WorldEdit";

import { chatReducer } from "./Chat";
import { userProfileReducer } from "./UserProfile";

// Other reducers (room entry/exit, mute reactions, etc.)
export const MiscReducers = {
  chat: chatReducer,
  userProfile: userProfileReducer,
  worldEditStartValues: worldEditStartValuesReducer,
  spaceCreateItem: spaceCreateItemReducer,
};
