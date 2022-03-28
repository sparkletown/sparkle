import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import { LoginForm, LoginFormData } from "./LoginForm";

type LoginFormHocProps = {
  displayRegisterForm: () => void;
  displayPasswordResetForm: () => void;
  closeAuthenticationModal?: () => void;
  afterUserIsLoggedIn?: (data?: LoginFormData) => void;
};

export const LoginFormHoc = (props: LoginFormHocProps) => {
  const { world, space, isLoading } = useWorldAndSpaceByParams();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!space || !world) {
    return <NotFoundFallback />;
  }

  return <LoginForm {...props} space={space} world={world} />;
};
