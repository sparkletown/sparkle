import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const useProfileInformationCheck = () => {
  const { user, usersByUid } = useSelector((state: any) => ({
    user: state.user,
    usersByUid: state.firestore.data.users,
  }));

  const history = useHistory();

  useEffect(() => {
    if (usersByUid && user && !usersByUid[user.uid]) {
      history.push("account/profile");
    }
  }, [usersByUid, history, user]);
};

export default useProfileInformationCheck;
