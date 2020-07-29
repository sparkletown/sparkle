//@debt typing I think this is correct from Room.tsx, need to confirm
type UserBartenderData = Record<string, { bartender: User }>;

export interface User {
  id: string;
  drinkOfChoice?: string;
  favouriteRecord?: string;
  doYouDance?: string;
  partyName?: string;
  pictureUrl?: string;
  data: UserBartenderData;
  lastSeenIn: string;
  room?: string;
}
