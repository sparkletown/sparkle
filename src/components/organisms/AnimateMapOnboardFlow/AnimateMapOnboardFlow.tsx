import React, { useCallback, useState } from "react";

import { AnimateMapOnboardModal } from "./AnimateMapOnboardModal";

import "./AnimateMapOnboardFlow.scss";

const FIRST_STEP = 1;
const LAST_STEP = 8;

export const AnimateMapOnboardFlow: React.FC = () => {
  const [step, setStep] = useState(FIRST_STEP);
  const advanceToNext = useCallback(() => setStep(step + 1), [step, setStep]);
  const advanceToLast = useCallback(() => setStep(LAST_STEP), [setStep]);

  return (
    <>
      <AnimateMapOnboardModal
        show={step === 1}
        onNext={advanceToNext}
        onSkip={advanceToLast}
        descriptionBottom="You need to allow the use of your microphone and camera to get started on the playa !"
      />
      <AnimateMapOnboardModal
        show={step === 2}
        onNext={advanceToNext}
        onSkip={advanceToLast}
        title="Information on the playa"
        posterSrc="/animatemap-onboard/step-02.svg"
      />

      <AnimateMapOnboardModal
        show={step === 3}
        onNext={advanceToNext}
        onSkip={advanceToLast}
        title="Information on the playa"
        posterSrc="/animatemap-onboard/step-03.svg"
      />
      <AnimateMapOnboardModal
        show={step === 4}
        onSkip={advanceToLast}
        onNext={advanceToNext}
        title="Information on the playa"
        posterSrc="/animatemap-onboard/step-04.svg"
      />
      <AnimateMapOnboardModal
        show={step === 5}
        onSkip={advanceToLast}
        onNext={advanceToNext}
        title="Interactions on the playa"
        posterSrc="/animatemap-onboard/step-05.svg"
      />
      <AnimateMapOnboardModal
        show={step === 6}
        onSkip={advanceToLast}
        onNext={advanceToNext}
        title="Interactions on the playa"
        posterSrc="/animatemap-onboard/step-06.svg"
      />
      <AnimateMapOnboardModal
        show={step === 7}
        onSkip={advanceToLast}
        onNext={advanceToNext}
        title="Interactions on the playa"
        posterSrc="/animatemap-onboard/step-07.svg"
        nextText="Enter"
      />
    </>
  );
};
