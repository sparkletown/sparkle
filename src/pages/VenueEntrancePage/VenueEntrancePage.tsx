import React, { useCallback } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import {
  EntranceStepTemplate,
  EntranceStepTemplateProps,
} from "types/EntranceStep";

import { isCompleteProfile } from "utils/profile";
import {
  accountProfileVenueUrl,
  attendeeSpaceInsideUrl,
  venueEntranceUrl,
} from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useUser } from "hooks/useUser";
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

  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space, spaceId, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);

  const { world, isLoaded: isWorldLoaded } = useWorldById(space?.worldId);
  const step = Number.parseInt(unparsedStep ?? "", 10);

  const proceed = useCallback(
    () =>
      spaceSlug &&
      history.push(venueEntranceUrl(worldSlug, spaceSlug, step + 1)),
    [worldSlug, spaceSlug, step, history]
  );

  if (!isSpaceLoaded || !isWorldLoaded) {
    return <LoadingPage />;
  }

  if (!spaceId || !space || !spaceSlug) {
    return <NotFound />;
  }

  const stepConfig = world?.entrance?.[step - 1];
  if (!stepConfig) {
    return <Redirect to={attendeeSpaceInsideUrl(world?.slug, spaceSlug)} />;
  }

  if (!user || !profile) {
    return <Login venueId={spaceId} />;
  }

  if (profile && !isCompleteProfile(profile)) {
    return <Redirect to={accountProfileVenueUrl(worldSlug, spaceSlug)} />;
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
