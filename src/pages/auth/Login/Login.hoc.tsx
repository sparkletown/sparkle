import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import { Login } from "./Login";

export const LoginHoc = () => {
  const { world, space, spaceId, isLoading } = useWorldAndSpaceByParams();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!space || !world || !spaceId) {
    return <NotFoundFallback />;
  }

  return <Login spaceId={spaceId} />;
};
