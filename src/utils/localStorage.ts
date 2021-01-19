export const accessTokenKey: (venueId: string) => string = (venueId) =>
  `token-${venueId}`;
