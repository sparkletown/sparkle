import React from "react";
import { TableGrid } from "components/attendee/TableGrid";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";

import { CONVERSATION_TABLES } from "settings";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { Loading } from "components/molecules/Loading";

import styles from "./ConversationSpace.module.scss";

export interface ConversationSpaceProps {
  venue: WithId<GenericVenue>;
}

export const ConversationSpace: React.FC<ConversationSpaceProps> = ({
  venue,
}) => {
  useBackgroundGradient();

  const { userId } = useUser();

  const tables = venue?.config?.tables ?? CONVERSATION_TABLES;

  if (!userId) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.componentSpaceInfo}>
        {venue.name && <h1>{venue.name}</h1>}
      </div>

      {venue.description?.text && (
        <div className="row">
          <div className="col">
            <div className="description">
              <RenderMarkdown text={venue.description?.text} />
            </div>
          </div>
        </div>
      )}

      <TableGrid
        venueId={venue.id}
        joinMessage={venue.hideVideo === false}
        customTables={tables}
        defaultTables={CONVERSATION_TABLES}
        venue={venue}
        userId={userId}
      />
    </>
  );
};
