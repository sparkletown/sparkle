import React, { FC } from "react";
import { Button } from "components/attendee/Button";
import { Spacer } from "components/attendee/Spacer";

import CN from "pages/auth/auth.module.scss";

interface InitialFormProps {
  displayLoginForm: () => void;
  displayRegisterForm: () => void;
}

export const InitialForm: FC<InitialFormProps> = ({
  displayLoginForm,
  displayRegisterForm,
}) => {
  return (
    <div data-bem="InitialForm" className={CN.container}>
      <Button onClick={displayRegisterForm} variant="primary">
        Create your account
      </Button>
      <Spacer>
        <div className={CN.center}>or</div>
      </Spacer>
      <Button onClick={displayLoginForm} variant="login" border="login">
        Log In
      </Button>
    </div>
  );
};
