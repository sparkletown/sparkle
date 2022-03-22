import React from "react";
import { TableGrid } from "components/attendee/TableGrid";

import { CONVERSATION_TABLES } from "settings";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";
import { SpaceInfoText } from "components/molecules/SpaceInfoText";

export interface ConversationSpaceProps {
  space: WithId<GenericVenue>;
  userId: string;
}

export const ConversationSpace: React.FC<ConversationSpaceProps> = ({
  space,
  userId,
}) => {
  const tables = space?.config?.tables ?? CONVERSATION_TABLES;

  const { userWithId } = useUser();

  if (!userWithId) {
    return <Loading />;
  }

  return (
    <>
      <SpaceInfoText space={space} />

      <TableGrid
        customTables={tables}
        defaultTables={CONVERSATION_TABLES}
        space={space}
        user={userWithId}
      />
    </>
  );
};
