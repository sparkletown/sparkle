import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export const useAdminV3NavigateHome = () => {
  const history = useHistory();

  return useCallback(() => {
    history.push("/admin-ng/");
  }, [history]);
};
