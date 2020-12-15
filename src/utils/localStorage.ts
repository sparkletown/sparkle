export const getAccessTokenKey: (venueId: string | undefined) => string = (
  venueId
) => `token-${venueId}`;
