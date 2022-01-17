import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

type DetermineDisplayName = <T>(Component: React.FC<T>) => string;

export const determineDisplayName: DetermineDisplayName = (Component) =>
  Component.displayName || Component.name || "Component";

type HoistHocStatics = <Twrapper, Twrapped>(
  name: string,
  Wrapper: React.FC<Twrapper>,
  Wrapped: React.FC<Twrapped>
) => void;

export const hoistHocStatics: HoistHocStatics = (name, Wrapper, Wrapped) => {
  hoistNonReactStatics(
    (Wrapper as unknown) as React.FC,
    (Wrapped as unknown) as React.FC
  );

  Wrapper.displayName = `${name}(${determineDisplayName(Wrapped)})`;
};
