import { useFirestoreConnect } from "hooks/useFirestoreConnect";

export const useAdminVenues = (userUid?: string) => {
  useFirestoreConnect({
    collection: "venues",
    where: [["owners", "array-contains", userUid || ""]],
  });
};
