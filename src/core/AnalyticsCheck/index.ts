import React from "react";
import { withRequired } from "components/hocs/withRequired";
import { withFetch } from "core/AnalyticsCheck/withFetch";
import { withLogin } from "core/AnalyticsCheck/withLogin";
import { withProfile } from "core/AnalyticsCheck/withProfile";
import { compose } from "lodash/fp";

import { LoadingPage } from "components/molecules/LoadingPage";

import { Check } from "./Check";

export const AnalyticsCheck: React.FC = compose(
  withLogin(),
  withProfile(),
  withFetch(),
  withRequired({ required: ["space"], fallback: LoadingPage })
)(Check);
