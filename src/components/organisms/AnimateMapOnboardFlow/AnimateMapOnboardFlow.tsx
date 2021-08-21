import React, { useCallback, useState } from "react";

import { DeviceVideo } from "components/atoms/DeviceVideo";

import { AnimateMapOnboardModal } from "./AnimateMapOnboardModal";

import "./AnimateMapOnboardFlow.scss";

// steps
const FIRST = 1;
const INFO = 2;
const INTERACT = 5;
const LAST = 8;

const INTER_TITLE = "Interactions on the playa";
const INFO_TITLE = "Information on the playa";

export const AnimateMapOnboardFlow: React.FC = () => {
  const [step, setStep] = useState(FIRST);
  const advanceToNext = useCallback(() => setStep(step + 1), [step, setStep]);
  const advanceToInfo = useCallback(() => setStep(INFO), [setStep]);
  const advanceToInteract = useCallback(() => setStep(INTERACT), [setStep]);
  const advanceToLast = useCallback(() => setStep(LAST), [setStep]);

  return (
    <>
      <AnimateMapOnboardModal
        show={step === 1}
        onNext={advanceToNext}
        onSkip={advanceToInfo}
        className="AnimateMapOnboardFlow__step-video"
      >
        <DeviceVideo />
        <div>
          You need to allow the use of your microphone and camera to get started
          on the playa !
        </div>
      </AnimateMapOnboardModal>
      <AnimateMapOnboardModal
        show={step === 2}
        onNext={advanceToNext}
        onSkip={advanceToInteract}
        title={INFO_TITLE}
        posterSrc="/animatemap-onboard/step-02.svg"
      />
      <AnimateMapOnboardModal
        show={step === 3}
        onNext={advanceToNext}
        onSkip={advanceToInteract}
        title={INFO_TITLE}
        posterSrc="/animatemap-onboard/step-03.svg"
      />
      <AnimateMapOnboardModal
        show={step === 4}
        onNext={advanceToNext}
        onSkip={advanceToInteract}
        title={INFO_TITLE}
        posterSrc="/animatemap-onboard/step-04.svg"
      />
      <AnimateMapOnboardModal
        show={step === 5}
        onNext={advanceToNext}
        onSkip={advanceToLast}
        title={INTER_TITLE}
        posterSrc="/animatemap-onboard/step-05.svg"
      />
      <AnimateMapOnboardModal
        show={step === 6}
        onNext={advanceToNext}
        onSkip={advanceToLast}
        title={INTER_TITLE}
        posterSrc="/animatemap-onboard/step-06.svg"
      />
      <AnimateMapOnboardModal
        show={step === 7}
        onNext={advanceToNext}
        onSkip={advanceToLast}
        title={INTER_TITLE}
        posterSrc="/animatemap-onboard/step-07.svg"
        nextText="Enter"
      />
    </>
  );
};
