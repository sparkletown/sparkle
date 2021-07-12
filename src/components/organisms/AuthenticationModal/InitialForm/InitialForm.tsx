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
      <p className="login-text">
        No Okta?{" "}
        <button className="login-button button--a" onClick={displayLoginForm}>
          Login here
        </button>
      </p>
    </div>
  );
};
