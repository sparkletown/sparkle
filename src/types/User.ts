interface Experience {
  bartender: User;
  table: string;
}

//@debt typing I think this is correct from Room.tsx, need to confirm
type UserExperienceData = Record<string, Experience>;

export interface User {
  id: string;
  drinkOfChoice?: string;
  favouriteRecord?: string;
  doYouDance?: string;
  partyName?: string;
  pictureUrl?: string;
  data?: UserExperienceData;
  lastSeenIn: string;
  room?: string;
}
