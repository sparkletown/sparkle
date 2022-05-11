import React from "react";
import { Redirect } from "react-router-dom";

import { ATTENDEE_SPACE_SPLASH_URL } from "settings";

import { SpaceSlug, UserId, WorldId, WorldSlug } from "types/id";

import { generateUrl } from "utils/url";

import { useOnboardingDetails } from "hooks/user/useOnboardingDetails";

import { Loading } from "components/molecules/Loading";

interface OnboardingGatedProps {
  userId: UserId;
  worldId: WorldId;
  worldSlug: WorldSlug;
  spaceSlug: SpaceSlug;
}

/**
 * This is a simple check and "redirect" component, no styles, just logic
 */
export const OnboardingGated: React.FC<OnboardingGatedProps> = ({
  userId,
  worldId,
  worldSlug,
  spaceSlug,
  children,
}) => {
  const { onboardingDetails, isLoading } = useOnboardingDetails({
    worldId,
    userId,
  });

  const isOnboarded = onboardingDetails?.isOnboarded;

  if (isLoading) {
    return <Loading />;
  }

  if (!isOnboarded) {
    const joinUrl = generateUrl({
      route: ATTENDEE_SPACE_SPLASH_URL,
      required: ["spaceSlug", "worldSlug"],
      params: { spaceSlug, worldSlug },
    });

    return <Redirect to={joinUrl} />;
  }

  return <>{children}</>;
};
