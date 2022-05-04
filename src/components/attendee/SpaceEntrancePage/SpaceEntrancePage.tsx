import React, { useCallback, useState } from "react";
import { WelcomeVideo } from "components/attendee/WelcomeVideo";

import {
  EntranceStepConfig,
  EntranceStepTemplate,
  EntranceStepTemplateProps,
} from "types/EntranceStep";

const ENTRANCE_STEP_TEMPLATE: Record<
  EntranceStepTemplate,
  React.FC<EntranceStepTemplateProps>
> = {
  [EntranceStepTemplate.WelcomeVideo]: WelcomeVideo,
};

type SpaceEntrancePageProps = {
  entrance: EntranceStepConfig[];
  proceed: () => void;
};

export const SpaceEntrancePage: React.FC<SpaceEntrancePageProps> = ({
  entrance,
  proceed,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const navigateToNextStep = useCallback(() => {
    const stepsCount = entrance.length;
    const isLastStep = currentStepIndex === stepsCount;

    if (isLastStep) {
      proceed();
      return;
    }

    setCurrentStepIndex(currentStepIndex + 1);
  }, [entrance, currentStepIndex, proceed, setCurrentStepIndex]);

  const stepConfig = entrance[currentStepIndex - 1];

  const EntranceStepTemplate: React.FC<EntranceStepTemplateProps> =
    ENTRANCE_STEP_TEMPLATE[stepConfig.template];

  if (!EntranceStepTemplate) {
    return null;
  }

  return (
    <EntranceStepTemplate config={stepConfig} proceed={navigateToNextStep} />
  );
};
