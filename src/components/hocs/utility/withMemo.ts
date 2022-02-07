import React from "react";
import { isEqual } from "lodash";

import { hoistHocStatics } from "utils/hoc";

export const withMemo = <T>(Component: React.FC<T>) => {
  const WithMemo = React.memo(Component, isEqual);

  hoistHocStatics("withMemo", WithMemo, Component);
  return WithMemo;
};
