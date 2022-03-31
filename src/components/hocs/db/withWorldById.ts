import React from "react";
import { get } from "lodash/fp";

import { WorldId, WorldIdLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useWorldById } from "hooks/worlds/useWorldById";

type WithWorldByIdInProps<T extends WorldIdLocation> = T;

export const withWorldById = <T extends WorldIdLocation>(
  Component: React.FC<WithWorldByIdInProps<T>>
) => {
  const WithWorldById = (props: WithWorldByIdInProps<T>) => {
    const { world, worldId, isLoaded } = useWorldById(props);

    return React.createElement(Component, {
      ...props,
      world,
      isWorldLoaded: isLoaded,
      isWorldLoading: !isLoaded,
      worldId: worldId ?? (get("worldId", props) as WorldId | undefined),
    });
  };

  hoistHocStatics("withWorldById", WithWorldById, Component);
  return WithWorldById;
};
