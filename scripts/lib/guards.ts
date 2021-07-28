/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from "types/User";

export const checkTypeObject = (o?: any): o is object =>
  null !== o && typeof o === "object";

export const checkTypeUser = (u?: any): u is User =>
  !!(u?.partyName && u?.pictureUrl);
