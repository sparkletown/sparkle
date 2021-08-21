import React, { useCallback, useState } from "react";

import { DeviceVideo } from "components/atoms/DeviceVideo";
import { SvgLoop } from "components/atoms/SvgLoop";

import { AnimateMapOnboardModal } from "./AnimateMapOnboardModal";

import "./AnimateMapOnboardFlow.scss";

// time in ms before next SVG is displayed
const DELAY = 3000;

// images for the first modal
const INFORMATION_SOURCES = [
  "/animatemap-onboard/step-02.svg",
  "/animatemap-onboard/step-03.svg",
  "/animatemap-onboard/step-04.svg",
];

// images for the second modal
const INTERACTION_SOURCES = [
  "/animatemap-onboard/step-05.svg",
  "/animatemap-onboard/step-06.svg",
  "/animatemap-onboard/step-07.svg",
];

export const AnimateMapOnboardFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const advanceToNext = useCallback(() => setStep(step + 1), [step, setStep]);
  const advanceToLast = useCallback(() => setStep(3), [setStep]);

  return (
    <>
      <AnimateMapOnboardModal
        show={step === 1}
        onNext={advanceToNext}
        onSkip={advanceToLast}
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
        onSkip={advanceToLast}
        title="Information on the playa"
      >
        <SvgLoop delay={DELAY} sources={INFORMATION_SOURCES} />
      </AnimateMapOnboardModal>
      <AnimateMapOnboardModal
        show={step === 3}
        onNext={advanceToNext}
        onSkip={advanceToLast}
        title="Interactions on the playa"
        nextText="Enter"
      >
        <SvgLoop delay={DELAY} sources={INTERACTION_SOURCES} />
      </AnimateMapOnboardModal>
    </>
  );
};
