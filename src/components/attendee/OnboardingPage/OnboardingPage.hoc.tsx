import { NotFound } from "components/shared/NotFound";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useLiveUser } from "hooks/user/useLiveUser";

import { LoadingPage } from "components/molecules/LoadingPage";

import { OnboardingPage } from "./OnboardingPage";

export const OnboardingPageHoc: React.FC = () => {
  const { profile, isLoading: isProfileLoading } = useLiveUser();

  const {
    world,
    space,
    isLoading: isSpaceLoading,
  } = useWorldAndSpaceByParams();

  if (isSpaceLoading || isProfileLoading) return <LoadingPage />;

  if (!world || !profile || !space) return <NotFound />;

  return <OnboardingPage world={world} space={space} />;
};
