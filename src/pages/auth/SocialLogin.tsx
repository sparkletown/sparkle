import React from "react";
import { Button } from "components/attendee/Button";
import { Spacer } from "components/attendee/Spacer";

import CN from "pages/auth/auth.module.scss";

type SocialLoginParams = {
  onGoogle: () => Promise<void>;
};

export const SocialLogin: React.FC<SocialLoginParams> = ({ onGoogle }) => (
  <Spacer>
    <div data-bem="SocialLogin" className={CN.socialLogin}>
      <Spacer>
        <div className={CN.center}>or</div>
      </Spacer>
      <Spacer>
        <Button variant="login" border="login" type="submit" onClick={onGoogle}>
          <span>Log in with Google</span>
        </Button>
      </Spacer>
    </div>
  </Spacer>
);
