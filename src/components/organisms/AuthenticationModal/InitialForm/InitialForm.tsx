import React, { FC } from "react";

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
    <div className="initial-form">
      <button
        className="btn btn-primary btn-block btn-centered create-account-button"
        onClick={displayRegisterForm}
      >
        Create your account
      </button>
      <div className="buttons-separator">or</div>
      <button
        className="btn btn-block btn-centered btn-primary login-button"
        onClick={displayLoginForm}
      >
        Log In
      </button>
    </div>
  );
};
