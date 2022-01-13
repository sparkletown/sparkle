import React from "react";

type DetermineDisplayName = (Component: React.FC) => string;

export const determineDisplayName: DetermineDisplayName = (Component) =>
  Component.displayName || Component.name || "Component";
