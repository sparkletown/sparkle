import React, { useCallback, useState } from "react";

import { updateUserOnboarding } from "api/profile";

import { VenueTemplate } from "types/venues";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { DeviceVideo } from "components/atoms/DeviceVideo";
import { OnboardingModal } from "components/atoms/OnboardingModal";
import { SvgLoop } from "components/atoms/SvgLoop";

import STEP_02 from "assets/images/AnimateMapOnboardFlow/step-02.svg";
import STEP_03 from "assets/images/AnimateMapOnboardFlow/step-03.svg";
import STEP_04 from "assets/images/AnimateMapOnboardFlow/step-04.svg";
import STEP_05 from "assets/images/AnimateMapOnboardFlow/step-05.svg";
import STEP_06 from "assets/images/AnimateMapOnboardFlow/step-06.svg";
import STEP_07 from "assets/images/AnimateMapOnboardFlow/step-07.svg";

// This flow works only for VenueTemplate.animatemap ATM
const TEMPLATE = VenueTemplate.animatemap;

const NO_STEP = Infinity;
const BASE_STEP = 0;

// time in ms before next SVG is displayed
const DELAY = 4000;

// images for the first modal
const INFORMATION_SOURCES = [STEP_02, STEP_03, STEP_04];

// images for the second modal
const INTERACTION_SOURCES = [STEP_05, STEP_06, STEP_07];

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
      <OnboardingModal
        show={step === BASE_STEP}
        onNext={next}
        onSkip={skip}
        className="AnimateMapOnboardFlow__step-video"
      >
        <h3>Click allow to enable your camera and microphone for later!</h3>
        <DeviceVideo />
        <div>
          For on playa interactions in Fire Barrels and Art Pieces, you’ll need
          to give access to your camera and microphone!
        </div>
      </OnboardingModal>
      <OnboardingModal
        show={step === BASE_STEP + 1}
        onNext={next}
        onSkip={skip}
        className="AnimateMapOnboardFlow__step-information"
        title="Information on the playa"
      >
        <SvgLoop delay={DELAY} sources={INFORMATION_SOURCES} />
      </OnboardingModal>
      <OnboardingModal
        show={step === BASE_STEP + 2}
        onNext={finish}
        onSkip={skip}
        className="AnimateMapOnboardFlow__step-interaction"
        title="Interactions on the playa"
        nextText="Enter"
      >
        <SvgLoop delay={DELAY} sources={INTERACTION_SOURCES} />
      </OnboardingModal>
    </>
  );
};
