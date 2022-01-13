import React from "react";

type DetermineDisplayName = <T extends object = object>(
  Component: React.FC<T>
) => string;

export const determineDisplayName: DetermineDisplayName = (Component) =>
  Component.displayName || Component.name || "Component";
