import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
} from "react-redux-firebase";

export const adminVenuesQuery = (
  userUid?: string
): ReduxFirestoreQuerySetting => ({
  collection: "venues",
  where: [["owners", "array-contains", userUid || ""]],
});

export const useAdminVenues = (userUid?: string) => {
  useFirestoreConnect(adminVenuesQuery(userUid));
};
