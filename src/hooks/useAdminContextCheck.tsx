import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";

import { ADMIN_OLD_ROOT_URL, ADMIN_ROOT_URL } from "settings";

export const useAdminContextCheck = () => {
  const location = useLocation();
  return useMemo(
    () => matchPath(location.pathname, [ADMIN_ROOT_URL, ADMIN_OLD_ROOT_URL]),
    [location]
  );
};
