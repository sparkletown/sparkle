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

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useUser } from "hooks/useUser";

import { Login } from "pages/Account/Login";
import { WelcomeVideo } from "pages/entrance/WelcomeVideo";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

const ENTRANCE_STEP_TEMPLATE: Record<
  EntranceStepTemplate,
  React.FC<EntranceStepTemplateProps>
> = {
  [EntranceStepTemplate.WelcomeVideo]: WelcomeVideo,
};

export const VenueEntrancePage: React.FC = () => {
  const history = useHistory();
  const { user, profile } = useUser();
  const { step: unparsedStep } = useParams<{ step?: string }>();

  const { worldSlug, spaceSlug } = useSpaceParams();
  const { world, space, spaceId, isLoaded } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

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

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!spaceId || !space || !spaceSlug || !world) {
    return <NotFound />;
  }

  const stepConfig = world.entrance?.[step - 1];
  if (Number.isNaN(step) || !stepConfig) {
    return (
      <Redirect to={generateAttendeeInsideUrl({ worldSlug, spaceSlug })} />
    );
  }

  if (!user || !profile) {
    return <Login />;
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
