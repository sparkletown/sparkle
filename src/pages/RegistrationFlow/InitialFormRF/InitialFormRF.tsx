import React, { FC } from "react";

import { ButtonRF } from "pages/RegistrationFlow/ButtonRF";
import { PaneRF } from "pages/RegistrationFlow/PaneRF";
import { SpanRF } from "pages/RegistrationFlow/SpanRF";

import "./InitialFormRF.scss";

interface InitialFormRFProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const InitialFormRF: FC<InitialFormRFProps> = ({
  onLogin,
  onRegister,
}) => {
  return (
    <PaneRF className="InitialFormRF">
      <ButtonRF onClick={onRegister} variant="primary">
        Create account
      </ButtonRF>
      <SpanRF className="InitialFormRF__separator">or</SpanRF>
      <ButtonRF onClick={onLogin} variant="seethrough">
        Log In
      </ButtonRF>
    </PaneRF>
  );
};
