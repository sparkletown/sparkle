import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";

import { ADMIN_V1_ROOT_URL, ADMIN_V3_ROOT_URL } from "settings";

export const useAdminContextCheck = () => {
  const location = useLocation();
  return useMemo(
    () => matchPath(location.pathname, [ADMIN_V3_ROOT_URL, ADMIN_V1_ROOT_URL]),
    [location]
  );
};
