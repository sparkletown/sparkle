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
      <div className="buttons-separator">or</div>
      <div className="btn btn-centered login-button" onClick={displayLoginForm}>
        Login for non-Hubbers
      </div>
    </div>
  );
};
