export const accessTokenKey = (venueId: string) => `token-${venueId}`;

export const setLocalStorageToken = (venueId: string, token: string) =>
  localStorage.setItem(accessTokenKey(venueId), token);

export const getLocalStorageToken = (venueId: string) =>
  localStorage.getItem(accessTokenKey(venueId));

export const removeLocalStorageToken = (venueId: string) =>
  localStorage.removeItem(accessTokenKey(venueId));

export enum LocalStorageItem {
  "prefillProfileData" = "prefillProfileData",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorageItem = (itemKey: LocalStorageItem, data: any) => {
  localStorage.setItem(itemKey, JSON.stringify(data));
};

export const getLocalStorageItem = (
  itemKey: LocalStorageItem
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any | undefined => {
  const itemData = localStorage.getItem(itemKey);

  if (itemData === null) return;

  return JSON.parse(itemData);
};
