import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { LoginFormData } from "pages/auth/LoginForm";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import { RegisterForm } from "./RegisterForm";

type RegisterFormHocProps = {
  displayLoginForm: () => void;
  displayPasswordResetForm: () => void;
  afterUserIsLoggedIn?: (data?: LoginFormData) => void;
  closeAuthenticationModal?: () => void;
};

export const RegisterFormHoc = (props: RegisterFormHocProps) => {
  const {
    world,
    space,
    spaceId,
    worldSlug,
    spaceSlug,
    isLoaded,
    isLoading,
  } = useWorldAndSpaceByParams();

  if (isLoading) {
    return <LoadingPage />;
  }

  return space && world && spaceId && spaceSlug && worldSlug ? (
    <RegisterForm
      {...props}
      space={space}
      world={world}
      spaceId={spaceId}
      spaceSlug={spaceSlug}
      worldSlug={worldSlug}
      isWorldLoaded={isLoaded}
    />
  ) : (
    <NotFoundFallback />
  );
};
