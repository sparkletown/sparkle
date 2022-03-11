import React, { useEffect } from "react";
import { MediaPlayer } from "components/attendee/MediaPlayer";
import { TableGrid } from "components/attendee/TableGrid";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";

import { JAZZBAR_TABLES } from "settings";

import { JazzbarVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";
import { SpaceInfo } from "components/molecules/SpaceInfo";

interface JazzProps {
  space: WithId<JazzbarVenue>;
}

export const JazzBar: React.FC<JazzProps> = ({ space }) => {
  const analytics = useAnalytics({ venue: space });

  useBackgroundGradient();

  const jazzbarTables = space.config?.tables ?? JAZZBAR_TABLES;

  const { userId } = useUserId();

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  if (!userId) {
    return <Loading />;
  }

  return (
    <>
      {!space.hideVideo && (
        <MediaPlayer url={space.iframeUrl} autoPlay={space.autoPlay || false} />
      )}

      <SpaceInfo space={space} />

      <TableGrid
        joinMessage={false}
        customTables={jazzbarTables}
        space={space}
        defaultTables={JAZZBAR_TABLES}
        userId={userId}
      />
    </>
  );
};
