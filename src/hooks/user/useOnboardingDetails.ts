import { useMemo } from "react";

import { COLLECTION_ONBOARDED_WORLDS, COLLECTION_USERS } from "settings";

import { LoadStatus } from "types/fire";
import { UserId, WorldId } from "types/id";
import { UserOnboardedWorld } from "types/User";

import { convertToFirestoreKey } from "utils/id";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

type UseProfileById = (options: {
  userId?: UserId;
  worldId?: WorldId;
}) => LoadStatus & {
  onboardingDetails?: UserOnboardedWorld;
};

export const useOnboardingDetails: UseProfileById = ({ userId, worldId }) => {
  const {
    data: onboardingDetails,
    error,
    isLoading,
    isLoaded,
  } = useRefiDocument<UserOnboardedWorld>([
    COLLECTION_USERS,
    convertToFirestoreKey(userId),
    COLLECTION_ONBOARDED_WORLDS,
    convertToFirestoreKey(worldId),
  ]);

  return useMemo(
    () => ({
      onboardingDetails,
      isLoading,
      isLoaded,
      error,
    }),
    [onboardingDetails, isLoading, isLoaded, error]
  );
};
