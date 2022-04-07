import React, { useCallback } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { WelcomeVideo } from "components/attendee/WelcomeVideo";

import {
  ACCOUNT_PROFILE_SPACE_PARAM_URL,
  ATTENDEE_STEPPING_PARAM_URL,
} from "settings";

import { World } from "api/world";

import {
  EntranceStepTemplate,
  EntranceStepTemplateProps,
} from "types/EntranceStep";
import { SpaceSlug, WorldSlug } from "types/id";
import { Profile } from "types/User";

import { isCompleteProfile } from "utils/profile";
import { generateAttendeeInsideUrl, generateUrl } from "utils/url";

const ENTRANCE_STEP_TEMPLATE: Record<
  EntranceStepTemplate,
  React.FC<EntranceStepTemplateProps>
> = {
  [EntranceStepTemplate.WelcomeVideo]: WelcomeVideo,
};

type SpaceEntrancePageProps = {
  profile: Profile;
  spaceSlug: SpaceSlug;
  world: World;
  worldSlug: WorldSlug;
};

export const SpaceEntrancePage: React.FC<SpaceEntrancePageProps> = ({
  profile,
  spaceSlug,
  world,
  worldSlug,
}) => {
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
          route: ACCOUNT_PROFILE_SPACE_PARAM_URL,
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

  return <EntranceStepTemplate config={stepConfig} proceed={proceed} />;
};