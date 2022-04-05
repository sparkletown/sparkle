import { NotFound } from "components/shared/NotFound";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { LoadingPage } from "components/molecules/LoadingPage";

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

  return space && world ? (
    <LoginForm {...props} space={space} world={world} />
  ) : (
    <NotFound />
  );
};
