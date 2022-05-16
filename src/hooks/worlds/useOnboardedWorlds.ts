import { useMemo } from "react";
import { collection, getFirestore, query, where } from "firebase/firestore";

import {
  COLLECTION_ONBOARDED_WORLDS,
  COLLECTION_USERS,
  FIELD_IS_ONBOARDED,
} from "settings";

import { LoadStatus } from "types/fire";
import { WorldId, WorldWithId } from "types/id";
import { UserOnboardedWorld } from "types/User";

import { withIdConverter } from "utils/converters";

import { useLiveQuery } from "hooks/fire/useLiveQuery";
import { useWorldsByNotHidden } from "hooks/worlds/useWorldsByNotHidden";

type UseOnboardedWorlds = ({
  userId,
}: {
  userId: string;
}) => LoadStatus & { onboardedWorlds: WorldWithId[] };

export const useOnboardedWorlds: UseOnboardedWorlds = ({ userId }) => {
  const memoizedQuery = useMemo(
    () =>
      query(
        collection(
          getFirestore(),
          COLLECTION_USERS,
          userId,
          COLLECTION_ONBOARDED_WORLDS
        ),
        where(FIELD_IS_ONBOARDED, "==", true)
      ).withConverter(withIdConverter<UserOnboardedWorld, WorldId>()),
    [userId]
  );

  console.log({ memoizedQuery });

  const {
    error: onboardedWorldsError,
    isLoading: onboardedWorldsLoading,
    isLoaded: onboardedWordsLoaded,
    data: onboardedWorldsData,
  } = useLiveQuery(memoizedQuery);

  const onboardedWorldIds = onboardedWorldsData?.map(
    (onboardedWorld) => onboardedWorld.id
  );

  const {
    worlds,
    error: worldsError,
    isLoaded: worldsLoaded,
    isLoading: worldsLoading,
  } = useWorldsByNotHidden();

  const error = onboardedWorldsError || worldsError;
  const isLoaded = onboardedWordsLoaded || worldsLoaded;
  const isLoading = onboardedWorldsLoading || worldsLoading;

  const onboardedWorlds = worlds.filter((world) =>
    onboardedWorldIds?.includes(world.id)
  );

  return useMemo(() => ({ error, isLoading, isLoaded, onboardedWorlds }), [
    error,
    isLoading,
    isLoaded,
    onboardedWorlds,
  ]);
};
