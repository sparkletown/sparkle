import React, { useCallback } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import {
  EntranceStepTemplate,
  EntranceStepTemplateProps,
} from "types/EntranceStep";

import { isCompleteProfile } from "utils/profile";
import {
  accountProfileVenueUrl,
  venueEntranceUrl,
  venueInsideUrl,
} from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useUser } from "hooks/useUser";
import { useSpaceParams } from "hooks/useVenueId";
import { useWorldById } from "hooks/worlds/useWorldById";

import Login from "pages/Account/Login";
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

  const spaceSlug = useSpaceParams();
  const { space, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);
  const venueId = space?.id;

  const { world, isLoaded: isWorldLoaded } = useWorldById(space?.worldId);
  const step = Number.parseInt(unparsedStep ?? "", 10);

  const proceed = useCallback(
    () => venueId && history.push(venueEntranceUrl(venueId, step + 1)),
    [venueId, step, history]
  );

  if (!isSpaceLoaded || !isWorldLoaded) {
    return <LoadingPage />;
  }

  if (!venueId || !space) {
    return <NotFound />;
  }

  const stepConfig = world?.entrance?.[step - 1];
  if (!stepConfig) {
    return <Redirect to={venueInsideUrl(venueId)} />;
  }

  if (!user || !profile) {
    return <Login venueId={venueId} />;
  }

  if (profile && !isCompleteProfile(profile)) {
    return <Redirect to={accountProfileVenueUrl(venueId)} />;
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
