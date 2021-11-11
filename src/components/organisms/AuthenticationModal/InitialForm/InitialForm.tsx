import React, { FC } from "react";

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
  return (
    <div className="InitialForm">
      <ButtonNG variant="login-primary" onClick={displayRegisterForm}>
        Create your account
      </ButtonNG>
      <div className="InitialForm__separator">or</div>
      <ButtonNG variant="login-outline" onClick={displayLoginForm}>
        Log In
      </ButtonNG>
    </div>
  );
};
