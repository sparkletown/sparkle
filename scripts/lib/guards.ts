import { User } from "types/User";

export const checkTypeUser = (u?: User): u is User =>
  !!(u?.partyName && u?.pictureUrl);
