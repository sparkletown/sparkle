import React, { FC } from "react";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./InitialForm.scss";

interface InitialFormProps {
  displayLoginForm: () => void;
  displayRegisterForm: () => void;
}

export const InitialForm: FC<InitialFormProps> = ({
  displayLoginForm,
  displayRegisterForm,
}) => {
  const { spaceSlug } = useSpaceParams();

  return (
    <div className="InitialForm">
      {spaceSlug && (
        <>
          <ButtonNG variant="login-primary" onClick={displayRegisterForm}>
            Create your account
          </ButtonNG>
          <div className="InitialForm__separator">or</div>
        </>
      )}
      <ButtonNG variant="login-outline" onClick={displayLoginForm}>
        Log In
      </ButtonNG>
    </div>
  );
};
