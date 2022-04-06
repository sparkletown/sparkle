export type UserPresenceDocument = {
  id: string;
  worldId: string;
  spaceId: string;
  userId: string;
  // Cached copies of various user attributes so that they can be used in
  // minimally displaying a user without additional fetches
  partyName?: string;
  userPictureUrl?: string;
  // The first time we saw this user, used for ordering so we can limit to most
  // recent users first if desired
  firstSeenAt: number;
  // The last time we saw this user. Used as a regular cleanup of old checkins to
  // catch the case where a user just closes their browser
  lastSeenAt: number;
};
