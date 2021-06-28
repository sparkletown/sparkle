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
      {/* @debt Removed for Okta SSO */}
      {/*<div*/}
      {/*  className="btn btn-primary btn-block btn-centered create-account-button"*/}
      {/*  onClick={displayRegisterForm}*/}
      {/*>*/}
      {/*  Create your account*/}
      {/*</div>*/}
      <div className="buttons-separator">or</div>
      <div
        className="btn btn-block btn-centered login-button"
        onClick={displayLoginForm}
      >
        Log in for non-Okta users
      </div>
    </div>
  );
};
