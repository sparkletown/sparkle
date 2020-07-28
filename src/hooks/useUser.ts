import { useSelector } from "react-redux";
import { User } from "types/User";
import { FirebaseReducer } from "react-redux-firebase";

//@debt once the code is migrated to typescript, this should be defined elsewhere
type FirebaseReducerState = FirebaseReducer.Reducer<User>;

export const useUser = () => {
  const { auth, profile } = useSelector(
    (state: { firebase: FirebaseReducerState }) => state.firebase
  );
  return {
    user: !auth.isEmpty ? auth : undefined,
    profile: !profile.isEmpty ? profile : undefined,
  };
};
