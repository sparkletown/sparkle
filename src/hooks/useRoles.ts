import { useFirestoreConnect } from "react-redux-firebase";
import { useUser } from "./useUser";
import { useSelector } from "./useSelector";

const useRoles = () => {
  const { user } = useUser();
  useFirestoreConnect({
    collection: "roles",
    where: [["emails", "array-contains", user?.email || ""]],
  });
  const roles = useSelector((state) => state.firestore.data.roles);
  // Simplify membership checks when in no roles
  return roles === null ? [] : roles;
};

export default useRoles;
