import React from "react";

import { determineDisplayName, hoistHocStatics } from "utils/hoc";

export const withPropsLog =
  <T = {}>(tag?: string) =>
  (component: React.FC<T>): React.FC<T> => {
    const displayName = determineDisplayName(component);

    const WithPropsLog = (props: T) => {
      const prefix = String(tag ?? "");
      console.log(prefix, ":", displayName, ":", props);
      return React.createElement(component, props);
    };

    hoistHocStatics("withPropsLog", WithPropsLog, component);
    return WithPropsLog;
  };
