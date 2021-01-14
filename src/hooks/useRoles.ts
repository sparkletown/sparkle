import { useFirestoreConnect } from "./useFirestoreConnect";
import { useUser } from "./useUser";
import { useSelector } from "./useSelector";

const useRoles = () => {
  const { user } = useUser();
  useFirestoreConnect({
    collection: "roles",
    where: [["users", "array-contains", user?.uid || ""]],
    storeAs: "userRoles",
  });
  useFirestoreConnect({
    collection: "roles",
    where: [["allowAll", "==", true]],
    storeAs: "allowAllRoles",
  });
  const { userRoles, allowAllRoles } = useSelector((state) => ({
    userRoles: state.firestore.data.userRoles,
    allowAllRoles: state.firestore.data.allowAllRoles,
  }));

  // Note: null here means data is loaded, but there was none.
  // A value of undefined indicates data is not loaded yet.
  // undefined should be returned so callers can show loading indications
  return {
    userRoles:
      userRoles === undefined
        ? undefined
        : userRoles === null
        ? []
        : Object.keys(userRoles),
    allowAllRoles:
      allowAllRoles === undefined
        ? undefined
        : allowAllRoles === null
        ? []
        : Object.keys(allowAllRoles),
    roles:
      userRoles === undefined || allowAllRoles === undefined
        ? undefined
        : [
            ...Object.keys(userRoles ?? []),
            ...Object.keys(allowAllRoles ?? []),
          ],
  };
};

export default useRoles;
