import React, { FC } from "react";

import { ButtonRF } from "pages/RegistrationFlow/ButtonRF";
import { PaneRF } from "pages/RegistrationFlow/PaneRF";

import { LinkButton } from "components/atoms/LinkButton";

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
      <LinkButton
        className="ButtonNG__button btn-primary"
        href="https://www.eventbrite.com/e/sparkleverse-2021-online-burn-tickets-167724347037"
      >
        {" "}
        Get a ticket
      </LinkButton>
      <ButtonRF onClick={onRegister} variant="seethrough">
        I&apos;ve got a ticket already
      </ButtonRF>
      Already have an account?
      <ButtonRF onClick={onLogin} isLink={true}>
        Log In
      </ButtonRF>
      <div>
        To access the digital playa, you need a{" "}
        <a href="https://sparklever.se/tickets">ticket</a>
      </div>
    </PaneRF>
  );
};
