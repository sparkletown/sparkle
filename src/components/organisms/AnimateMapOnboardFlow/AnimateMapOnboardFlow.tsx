import React, { useCallback, useState } from "react";

import { updateUserOnboarding } from "api/profile";

import { VenueTemplate } from "types/venues";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { DeviceVideo } from "components/atoms/DeviceVideo";
import { SvgLoop } from "components/atoms/SvgLoop";

import { AnimateMapOnboardModal } from "./AnimateMapOnboardModal";

// This flow works only for VenueTemplate.animatemap ATM
const TEMPLATE = VenueTemplate.animatemap;

const NO_STEP = Infinity;
const BASE_STEP = 0;

// time in ms before next SVG is displayed
const DELAY = 4000;

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
  const { userWithId: user } = useUser();
  const venueId = useVenueId();
  const [step, setStep] = useState(
    // if user is already onboarded there will be no steps to take
    user?.onboarded?.perTemplate?.[TEMPLATE] ? NO_STEP : BASE_STEP
  );
  const next = useCallback(() => setStep(step + 1), [step, setStep]);
  const skip = useCallback(() => setStep(NO_STEP), [setStep]);

  const finish = useCallback(() => {
    const userId = user?.id;
    skip();
    if (userId) {
      updateUserOnboarding({ userId, venueId, template: TEMPLATE }).catch((e) =>
        console.error(AnimateMapOnboardFlow.name, e)
      );
    }
  }, [user, venueId, skip]);

  return (
    <>
      <AnimateMapOnboardModal
        show={step === BASE_STEP}
        onNext={next}
        onSkip={skip}
        className="AnimateMapOnboardFlow__step-video"
      >
        <DeviceVideo />
        <div>
          You need to allow the use of your microphone and camera to get started
          on the playa !
        </div>
      </AnimateMapOnboardModal>
      <AnimateMapOnboardModal
        show={step === BASE_STEP + 1}
        onNext={next}
        onSkip={skip}
        className="AnimateMapOnboardFlow__step-information"
        title="Information on the playa"
      >
        <SvgLoop delay={DELAY} sources={INFORMATION_SOURCES} />
      </AnimateMapOnboardModal>
      <AnimateMapOnboardModal
        show={step === BASE_STEP + 2}
        onNext={finish}
        onSkip={skip}
        className="AnimateMapOnboardFlow__step-interaction"
        title="Interactions on the playa"
        nextText="Enter"
      >
        <SvgLoop delay={DELAY} sources={INTERACTION_SOURCES} />
      </AnimateMapOnboardModal>
    </>
  );
};
