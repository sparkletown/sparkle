export const accessTokenKey = (venueId: string) => `token-${venueId}`;

export const setLocalStorageToken = (venueId: string, token: string) =>
  localStorage.setItem(accessTokenKey(venueId), token);

export const getLocalStorageToken = (venueId: string) =>
  localStorage.getItem(accessTokenKey(venueId));

export const removeLocalStorageToken = (venueId: string) =>
  localStorage.removeItem(accessTokenKey(venueId));

export enum LocalStorageItem {
  'prefillProfileData' = "prefillProfileData"
}

export const setLocalStorageItem = (item: LocalStorageItem)
