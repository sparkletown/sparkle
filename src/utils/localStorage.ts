export const localStorageTokenKey: (venueId: string | undefined) => string = (
  venueId
) => `token-${venueId}`;
