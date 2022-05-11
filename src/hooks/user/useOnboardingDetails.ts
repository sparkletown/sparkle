import { useMemo } from "react";

import {
  COLLECTION_ONBOARDED_WORLDS,
  COLLECTION_USERS,
  DEFERRED,
} from "settings";

import { LoadStatus } from "types/fire";
import { UserId, WorldId } from "types/id";
import { UserOnboardedWorld } from "types/User";

import { convertToFirestoreKey } from "utils/id";

import { useLiveDocument } from "hooks/fire/useLiveDocument";

type UseProfileById = (options: {
  userId?: UserId;
  worldId?: WorldId;
}) => LoadStatus & {
  onboardingDetails?: UserOnboardedWorld;
};

export const useOnboardingDetails: UseProfileById = ({ userId, worldId }) => {
  const hasUserIdAndWorldId = userId && worldId;

  const {
    data: onboardingDetails,
    error,
    isLoading,
    isLoaded,
  } = useLiveDocument<UserOnboardedWorld>(
    hasUserIdAndWorldId
      ? [
          COLLECTION_USERS,
          convertToFirestoreKey(userId),
          COLLECTION_ONBOARDED_WORLDS,
          convertToFirestoreKey(worldId),
        ]
      : DEFERRED
  );

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
