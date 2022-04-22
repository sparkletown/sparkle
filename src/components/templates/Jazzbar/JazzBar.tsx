import React, { useEffect } from "react";
import { BoothGrid } from "components/attendee/BoothGrid";
import { MediaElement } from "components/attendee/MediaElement";
import { StaticInfoBlock } from "components/attendee/StaticInfoBlock";
import { TableGrid } from "components/attendee/TableGrid";

import { JAZZBAR_TABLES } from "settings";

import { JazzBarSpaceWithId } from "types/id";

import { useAnalytics } from "hooks/useAnalytics";
import { useLiveUser } from "hooks/user/useLiveUser";

import { Loading } from "components/molecules/Loading";
import { SpaceInfoText } from "components/molecules/SpaceInfoText";

interface JazzProps {
  space: JazzBarSpaceWithId;
}

export const JazzBar: React.FC<JazzProps> = ({ space }) => {
  const analytics = useAnalytics({ venue: space });

  const jazzbarTables = space.config?.tables ?? JAZZBAR_TABLES;

  const { userWithId } = useLiveUser();

  useEffect(() => {
    analytics.trackEnterJazzBarEvent();
  }, [analytics]);

  if (!userWithId) {
    return <Loading />;
  }

  return (
    <>
      {!space.hideVideo && (
        <MediaElement
          url={space.iframeUrl}
          autoPlay={space.autoPlay || false}
        />
      )}

      <SpaceInfoText space={space} />

      <TableGrid
        customTables={jazzbarTables}
        space={space}
        defaultTables={JAZZBAR_TABLES}
        user={userWithId}
      />

      {space.boothsEnabled && (
        <>
          <StaticInfoBlock
            title="Meeting Rooms"
            subtitle="Have meetings with video chat and screen sharing."
          />
          <BoothGrid space={space} user={userWithId} />
        </>
      )}
    </>
  );
};
