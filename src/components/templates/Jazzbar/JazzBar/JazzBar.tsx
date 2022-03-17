import React, { useEffect } from "react";
import { MediaPlayer } from "components/attendee/MediaPlayer";
import { TableGrid } from "components/attendee/TableGrid";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";

import { JAZZBAR_TABLES } from "settings";

import { JazzbarVenue } from "types/venues";

import { WithId } from "utils/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";
import { SpaceInfoText } from "components/molecules/SpaceInfoText";

interface JazzProps {
  space: WithId<JazzbarVenue>;
}

export const JazzBar: React.FC<JazzProps> = ({ space }) => {
  const analytics = useAnalytics({ venue: space });

  useBackgroundGradient();

  const jazzbarTables = space.config?.tables ?? JAZZBAR_TABLES;

  const { userWithId } = useUser();

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  if (!userWithId) {
    return <Loading />;
  }

  return (
    <>
      {!space.hideVideo && (
        <MediaPlayer url={space.iframeUrl} autoPlay={space.autoPlay || false} />
      )}

      <SpaceInfoText space={space} />

      <TableGrid
        customTables={jazzbarTables}
<<<<<<< HEAD
        space={space}
=======
        space={venue}
>>>>>>> aa02d53e8... Basic run at seating
        defaultTables={JAZZBAR_TABLES}
        user={userWithId}
      />
    </>
  );
};
