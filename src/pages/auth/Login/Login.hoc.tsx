import { NotFound } from "components/shared/NotFound";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { LoadingPage } from "components/molecules/LoadingPage";

import { Login } from "./Login";

export const LoginHoc = () => {
  const { world, space, spaceId, isLoading } = useWorldAndSpaceByParams();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!space || !world || !spaceId) {
    return <NotFound />;
  }

  return <Login spaceId={spaceId} />;
};
