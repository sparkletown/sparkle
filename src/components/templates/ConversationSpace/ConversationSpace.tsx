import React from "react";
import { TableGrid } from "components/attendee/TableGrid";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";

import { CONVERSATION_TABLES } from "settings";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";

import { SpaceInfoText } from "components/molecules/SpaceInfoText";

export interface ConversationSpaceProps {
  space: WithId<GenericVenue>;
  userId: string;
}

export const ConversationSpace: React.FC<ConversationSpaceProps> = ({
  space,
  userId,
}) => {
  useBackgroundGradient();

  const tables = space?.config?.tables ?? CONVERSATION_TABLES;

  return (
    <>
      <SpaceInfoText space={space} />

      <TableGrid
        joinMessage={space.hideVideo === false}
        customTables={tables}
        defaultTables={CONVERSATION_TABLES}
        space={space}
        userId={userId}
      />
    </>
  );
};
