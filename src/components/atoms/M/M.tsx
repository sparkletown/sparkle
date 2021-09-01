import React from "react";

import { DEFAULT_MESSAGES } from "assets/messages";

const findMessage: (key: string) => string = (key) => DEFAULT_MESSAGES[key];

export const M: React.FC = ({ children }) => {
  if (typeof children === "string") {
    return <>{findMessage(children) ?? children}</>;
  }

  if (Array.isArray(children)) {
    return <>{findMessage(children.join("")) ?? children}</>;
  }

  return <>{children}</>;
};
