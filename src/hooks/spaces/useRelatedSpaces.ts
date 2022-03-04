import { useMemo } from "react";
import { where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, DEFERRED, FIELD_WORLD_ID, PATH } from "settings";

import {
  MaybeSpaceIdLocation,
  MaybeWorldAndSpaceIdLocation,
  SpaceId,
  SpaceWithId,
} from "types/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

type FindSpaceInArray = (
  options: MaybeSpaceIdLocation & {
    spaces?: SpaceWithId[];
  }
) => SpaceWithId | undefined;

const findSpaceInArray: FindSpaceInArray = ({ spaceId, spaces }) =>
  spaceId && Array.isArray(spaces)
    ? spaces.find(({ id }) => id === spaceId)
    : undefined;

type FindRoot = (options: {
  spaceId?: SpaceId;
  spaces?: SpaceWithId[];
  descendantIds?: readonly string[];
  maxDepth?: number;
}) => {
  root: SpaceWithId | undefined;
  descendantIds: readonly string[];
  error: Error | undefined;
};

const findRoot: FindRoot = (options) => {
  const root = findSpaceInArray(options);
  const descendantIds = options?.descendantIds ?? ALWAYS_EMPTY_ARRAY;
  const spaceId = options?.spaceId;
  const parentId = root?.parentId as SpaceId | undefined;

  if (!spaceId || !root || !parentId) {
    return { root, descendantIds, error: undefined };
  }

  if (descendantIds.includes(spaceId)) {
    return {
      root,
      descendantIds,
      error: new Error(
        `Circular reference detected. '${spaceId}' has already been checked`
      ),
    };
  }

  const maxDepth = options?.maxDepth || undefined;

  if (typeof maxDepth === "number" && maxDepth <= 0) {
    return {
      root,
      descendantIds,
      error: new Error("Maximum depth reached before finding the root space."),
    };
  }

  return findRoot({
    spaces: options?.spaces,
    spaceId: parentId,
    descendantIds: Object.freeze([...(descendantIds ?? []), spaceId]),
    maxDepth: maxDepth && maxDepth - 1,
  });
};

export const useRelatedSpaces = (options?: MaybeWorldAndSpaceIdLocation) => {
  const { worldId, spaceId } = options ?? {};

  const {
    error: spacesError,
    data: spaces,
    ...extra
  } = useLiveCollection<SpaceWithId>({
    path: PATH.spaces,
    constraints: [worldId ? where(FIELD_WORLD_ID, "==", worldId) : DEFERRED],
  });

  const space = useMemo(() => findSpaceInArray({ spaceId, spaces }), [
    spaceId,
    spaces,
  ]);

  const parentId = space?.parentId as SpaceId | undefined;
  const parent = findSpaceInArray({ spaceId: parentId, spaces });

  const { descendantIds, root, error: rootError } = findRoot({
    spaces,
    spaceId,
  });

  const rootId = root?.id as SpaceId | undefined;

  return useMemo(
    () => ({
      ...extra,
      worldId,
      spaceId,
      space,
      spaces: spaces ?? ALWAYS_EMPTY_ARRAY,
      parent,
      parentId,
      root,
      rootId,
      descendantIds,
      error: spacesError || rootError || undefined,
    }),
    [
      extra,
      worldId,
      spaceId,
      space,
      spaces,
      parent,
      parentId,
      root,
      rootId,
      descendantIds,
      spacesError,
      rootError,
    ]
  );
};
