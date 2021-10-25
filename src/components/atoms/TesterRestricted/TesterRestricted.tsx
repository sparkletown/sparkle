import React from "react";

import { useUser } from "hooks/useUser";

export const TesterRestricted: React.FC = ({ children }) => {
  // this simple component should add nothing more if user isn't tester like a message to the user or console
  // also, should not add anything more if user is tester, no classes, wrapper divs etc.
  // possible future enhancement might be props for checking specific functionality
  const { isTester } = useUser();
  return isTester ? <>{children}</> : null;
};
