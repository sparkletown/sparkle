import React from "react";
import { Route, Switch } from "react-router-dom";

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
      <Route path="/enter/step1" component={Step1} />
      <Route path="/enter/step2" component={Step2} />
      <Route path="/enter/step3" component={Step3} />
      <Route path="/enter/step4" component={Step4} />
      <Route path="/enter/step5" component={Step5} />
      <Route path="/enter/step6a" component={Step6a} />
      <Route path="/enter/step6b" component={Step6b} />
      {/* @debt This appears to be a legacy route related to the old Playa template. Likely to be removed in future. */}
      {/*<Route path="/enter" component={SplashPage} />*/}
    </Switch>
  );
};
