import { NotFound } from "components/shared/NotFound";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useLiveUser } from "hooks/user/useLiveUser";

import { LoadingPage } from "components/molecules/LoadingPage";

import { SpaceEntrancePage } from "./SpaceEntrancePage";

export const SpaceEntrancePageHoc: React.FC = () => {
  const { profile, isLoading: isProfileLoading } = useLiveUser();

  const {
    world,
    space,
    spaceSlug,
    worldSlug,
    isLoading: isSpaceLoading,
  } = useWorldAndSpaceByParams();

  if (isSpaceLoading || isProfileLoading) return <LoadingPage />;

  if (!space || !spaceSlug || !world || !profile) return <NotFound />;

  return (
    <SpaceEntrancePage
      spaceSlug={spaceSlug}
      world={world}
      worldSlug={worldSlug}
      profile={profile}
    />
  );
};
