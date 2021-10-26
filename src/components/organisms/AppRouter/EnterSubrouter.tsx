import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ENTER_STEP_1_URL,
  ENTER_STEP_2_URL,
  ENTER_STEP_3_URL,
  ENTER_STEP_4_URL,
  ENTER_STEP_5_URL,
  ENTER_STEP_6A_URL,
  ENTER_STEP_6B_URL,
} from "settings";

// import { SplashPage } from "pages/Account/SplashPage";
import Step1 from "pages/Account/Step1";
import Step2 from "pages/Account/Step2";
import Step3 from "pages/Account/Step3";
import Step4 from "pages/Account/Step4";
import Step5 from "pages/Account/Step5";
import Step6a from "pages/Account/Step6a";
import Step6b from "pages/Account/Step6b";

// @debt I believe this is legacy tech debt related to the Playa template. To be cleaned up properly in future.
export const EnterSubrouter: React.FC = () => {
  return (
    <Switch>
      <Route path={ENTER_STEP_1_URL} component={Step1} />
      <Route path={ENTER_STEP_2_URL} component={Step2} />
      <Route path={ENTER_STEP_3_URL} component={Step3} />
      <Route path={ENTER_STEP_4_URL} component={Step4} />
      <Route path={ENTER_STEP_5_URL} component={Step5} />
      <Route path={ENTER_STEP_6A_URL} component={Step6a} />
      <Route path={ENTER_STEP_6B_URL} component={Step6b} />
      {/* @debt This appears to be a legacy route related to the old Playa template. Likely to be removed in future. */}
      {/*<Route path={ENTER_ROOT_URL} component={SplashPage} />*/}
    </Switch>
  );
};
