import React, { useCallback } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import {
  ACCOUNT_PROFILE_VENUE_PARAM_URL,
  ATTENDEE_STEPPING_PARAM_URL,
} from "settings";

import {
  EntranceStepTemplate,
  EntranceStepTemplateProps,
} from "types/EntranceStep";

import { isCompleteProfile } from "utils/profile";
import { generateAttendeeInsideUrl, generateUrl } from "utils/url";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";

import { WelcomeVideo } from "pages/entrance/WelcomeVideo";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

const ENTRANCE_STEP_TEMPLATE: Record<
  EntranceStepTemplate,
  React.FC<EntranceStepTemplateProps>
> = {
  [EntranceStepTemplate.WelcomeVideo]: WelcomeVideo,
};

export const VenueEntrancePage: React.FC = () => {
  const { profile, isLoading: isProfileLoading } = useUser();
  const {
    worldSlug,
    spaceSlug,
    world,
    space,
    isLoading: isSpaceLoading,
  } = useWorldAndSpaceByParams();
  const history = useHistory();
  const { step: unparsedStep } = useParams<{ step?: string }>();

  const step = Number.parseInt(unparsedStep ?? "", 10);

  const proceed = useCallback(
    () =>
      history.push(
        generateUrl({
          route: ATTENDEE_STEPPING_PARAM_URL,
          required: ["worldSlug", "spaceSlug", "step"],
          params: { worldSlug, spaceSlug, step: `${step + 1}` },
        })
      ),
    [worldSlug, spaceSlug, step, history]
  );

  if (isSpaceLoading || isProfileLoading) {
    return <LoadingPage />;
  }

  if (!space || !world) {
    return <NotFound />;
  }

  const stepConfig = world.entrance?.[step - 1];
  if (Number.isNaN(step) || !stepConfig) {
    return (
      <Redirect to={generateAttendeeInsideUrl({ worldSlug, spaceSlug })} />
    );
  }

  if (profile && !isCompleteProfile(profile)) {
    return (
      <Redirect
        to={generateUrl({
          route: ACCOUNT_PROFILE_VENUE_PARAM_URL,
          required: ["worldSlug"],
          params: { worldSlug, spaceSlug },
        })}
      />
    );
  }

  const EntranceStepTemplate: React.FC<EntranceStepTemplateProps> =
    ENTRANCE_STEP_TEMPLATE[stepConfig.template];

  if (!EntranceStepTemplate) {
    return null;
  }

  return (
    <EntranceStepTemplate
      venueName={space.name}
      config={stepConfig}
      proceed={proceed}
    />
  );
};
