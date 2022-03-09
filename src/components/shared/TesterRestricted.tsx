import React from "react";

import { useLiveProfile } from "hooks/user/useLiveProfile";
import { useUserId } from "hooks/user/useUserId";

export const TesterRestricted: React.FC = ({ children }) => {
  // this simple component should add nothing more if user isn't tester like a message to the user or console
  // also, should not add anything more if user is tester, no classes, wrapper divs etc.
  // possible future enhancement might be props for checking specific functionality
  const result = useUserId();
  const { isTester } = useLiveProfile(result);
  return isTester ? <>{children}</> : null;
};
