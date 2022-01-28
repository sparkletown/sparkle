import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { STRING_EMPTY } from "settings";

type DetermineDisplayName = <T>(
  Component: React.FC<T>,
  options?: { defaultName: string }
) => string;

export const determineDisplayName: DetermineDisplayName = (
  Component,
  options
) => {
  return (
    Component.displayName ||
    Component.name ||
    (undefined !== options?.defaultName ? options?.defaultName : "Component")
  );
};

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

export const checkBlockerProp = (value: unknown) =>
  null === value ||
  undefined === value ||
  false === value ||
  STRING_EMPTY === value;
