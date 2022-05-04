import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Redirect } from "react-router-dom";
import { SpaceEntrancePage } from "components/attendee/SpaceEntrancePage";

import { ALWAYS_EMPTY_ARRAY, ATTENDEE_WORLD_URL } from "settings";

import { onboardUser } from "api/auth";

import { WorldWithId } from "types/id";

import { generateUrl } from "utils/url";

import { CodeOfConduct } from "pages/Account/CodeOfConduct";

const codeOfConductStep = "CODE_OF_CONDUCT_STEP";
const ageLimitStep = "AGE_LIMIT_STEP";
const entryVideoStep = "ENTRY_VIDEO_STEP";
const onboardingStep = "ONBOARDING";

type OnboardingPageProps = {
  world: WorldWithId;
};

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ world }) => {
  const codeOfConductQuestions = world.questions?.code ?? ALWAYS_EMPTY_ARRAY;
  const hasCodeOfConductQuestions = codeOfConductQuestions.length > 0;

  const hasAgeLimit = true;

  const entryVideo = world.entrance ?? ALWAYS_EMPTY_ARRAY;
  const hasEntryVideo = entryVideo.length > 0;

  const steps = useMemo(
    () =>
      [
        hasCodeOfConductQuestions ? codeOfConductStep : undefined,
        hasAgeLimit ? ageLimitStep : undefined,
        hasEntryVideo ? entryVideoStep : undefined,
      ].filter(Boolean),
    [hasCodeOfConductQuestions, hasAgeLimit, hasEntryVideo]
  );

  const [firstStep] = steps;

  const [currentStep, setCurrentStep] = useState(firstStep);

  const navigateToNextStep = useCallback(() => {
    const stepsCount = steps.length;
    const currentStepIndex = steps.indexOf(currentStep);
    const isLastStep = currentStepIndex === stepsCount;

    if (isLastStep) {
      setCurrentStep(undefined);
      return;
    }

    const nextStep = steps[currentStepIndex + 1];

    setCurrentStep(nextStep);
  }, [steps, setCurrentStep, currentStep]);

  const finishOnboarding = useCallback(async () => {
    await onboardUser({ worldSlug: world.slug });

    setCurrentStep(onboardingStep);
  }, [world.slug]);

  useEffect(() => {
    if (!currentStep) {
      finishOnboarding();
    }
  }, [currentStep, finishOnboarding]);

  if (currentStep === codeOfConductStep) {
    return <CodeOfConduct proceed={navigateToNextStep} world={world} />;
  }

  if (currentStep === ageLimitStep) {
    // Temporary replacement for the age check
    return (
      <div>
        Age limit check.{" "}
        <p>
          <button onClick={navigateToNextStep}>Next</button>
        </p>
      </div>
    );
  }

  if (currentStep === entryVideoStep) {
    return (
      <SpaceEntrancePage entrance={entryVideo} proceed={navigateToNextStep} />
    );
  }

  if (currentStep === onboardingStep) {
    const worldUrl = generateUrl({
      route: ATTENDEE_WORLD_URL,
      required: ["worldSlug"],
      params: { worldSlug: world.slug },
    });
    return <Redirect to={worldUrl} />;
  }

  return <div>Onboarding a person</div>;
};
