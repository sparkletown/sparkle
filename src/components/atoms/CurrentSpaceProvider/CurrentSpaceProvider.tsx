import { createContext, useContext, useMemo } from "react";

import { World } from "api/world";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

export type CurrentSpaceContextState = {
  currentSpace: WithId<AnyVenue>;
  currentWorld: WithId<World>;
};

const CurrentSpaceContext = createContext<CurrentSpaceContextState | undefined>(
  undefined
);

export const CurrentSpaceProvider: React.FC<{}> = ({ children }) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { world, space, isLoaded, error } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );
  const state: CurrentSpaceContextState | undefined = useMemo(() => {
    if (error || !world || !space) {
      return undefined;
    }
    return {
      currentSpace: space,
      currentWorld: world,
    };
  }, [error, space, world]);

  if (error || !space || !world) {
    return <p>Error :( {error}</p>;
  }

  if (!isLoaded) {
    return <p>Loading! :)</p>;
  }

  return (
    <CurrentSpaceContext.Provider value={state}>
      {children}
    </CurrentSpaceContext.Provider>
  );
};

export const useCurrentSpace = (): CurrentSpaceContextState => {
  const state = useContext(CurrentSpaceContext);
  if (!state) {
    throw new Error(
      // @debt ideally this shouldn't need capturing
      "Should not have got this far in the component hierarchy"
    );
  }
  return state;
};
