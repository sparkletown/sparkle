import React, { FC } from "react";

import "./InitialForm.scss";

interface InitialFormProps {
  displayLoginForm: () => void;
  displayRegisterForm: () => void;
  showSeparator?: boolean;
}

export const InitialForm: FC<InitialFormProps> = ({
  displayLoginForm,
  displayRegisterForm,
  showSeparator = true,
}) => {
  return (
    <div className="initial-form">
      <div
        className="btn btn-primary btn-block btn-centered create-account-button"
        onClick={displayRegisterForm}
      >
        Create your account
      </div>
      {showSeparator && <div className="buttons-separator">or</div>}
      <div
        className="btn btn-block btn-centered login-button"
        onClick={displayLoginForm}
      >
        Log In
      </div>
    </div>
  );
};
