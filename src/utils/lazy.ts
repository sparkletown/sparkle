import React from "react";

export const lazyImport = (path: string, name: string) =>
  React.lazy(() =>
    import(path).then(({ [name]: component }) => ({ default: component }))
  );
