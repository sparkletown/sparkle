import React from "react";
import { Route, Switch } from "react-router-dom";
import { AnalyticsCheck } from "core/AnalyticsCheck";

import {
  ENTER_STEP_1_URL,
  ENTER_STEP_2_URL,
  ENTER_STEP_3_URL,
  ENTER_STEP_4_URL,
  ENTER_STEP_5_URL,
  ENTER_STEP_6A_URL,
  ENTER_STEP_6B_URL,
} from "settings";

import Step1 from "pages/Account/Step1";
import Step2 from "pages/Account/Step2";
import Step3 from "pages/Account/Step3";
import Step4 from "pages/Account/Step4";
import Step5 from "pages/Account/Step5";
import Step6a from "pages/Account/Step6a";
import Step6b from "pages/Account/Step6b";

// @debt Most likely legacy tech related to the Playa template. To be cleaned up properly in future.
export const EnterSubRouter: React.FC = () => {
  return (
    <Switch>
      <Route path={ENTER_STEP_1_URL}>
        <AnalyticsCheck>
          <Step1 />
        </AnalyticsCheck>
      </Route>
      <Route path={ENTER_STEP_2_URL}>
        <AnalyticsCheck>
          <Step2 />
        </AnalyticsCheck>
      </Route>
      <Route path={ENTER_STEP_3_URL}>
        <AnalyticsCheck>
          <Step3 />
        </AnalyticsCheck>
      </Route>
      <Route path={ENTER_STEP_4_URL}>
        <AnalyticsCheck>
          <Step4 />
        </AnalyticsCheck>
      </Route>
      <Route path={ENTER_STEP_5_URL}>
        <AnalyticsCheck>
          <Step5 />
        </AnalyticsCheck>
      </Route>
      <Route path={ENTER_STEP_6A_URL}>
        <AnalyticsCheck>
          <Step6a />
        </AnalyticsCheck>
      </Route>
      <Route path={ENTER_STEP_6B_URL}>
        <AnalyticsCheck>
          <Step6b />
        </AnalyticsCheck>
      </Route>
    </Switch>
  );
};
