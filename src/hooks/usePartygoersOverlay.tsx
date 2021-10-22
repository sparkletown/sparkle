import React, { useMemo } from "react";

import { EmojiReactionType } from "types/reactions";
import { User } from "types/User";
import { ReactHook } from "types/utility";

import { WithId } from "utils/id";

import { MapPartygoerOverlay } from "components/molecules/MapPartygoerOverlay";

interface UsePartygoersOverlay {
  showGrid?: boolean;
  userUid?: string;
  venueId: string;
  withMiniAvatars?: boolean;
  rows: number;
  columns: number;
  partygoers: readonly WithId<User>[];
  peopleRequesting?: readonly WithId<User>[];
  emojiUserPersistentReaction?: EmojiReactionType;
}

export type UsePartygoersReturn =
  | ("" | JSX.Element)[]
  | JSX.Element
  | undefined;

export const usePartygoersOverlay: ReactHook<
  UsePartygoersOverlay,
  UsePartygoersReturn
> = ({
  showGrid,
  userUid,
  venueId,
  withMiniAvatars,
  rows,
  columns,
  partygoers,
  peopleRequesting,
  emojiUserPersistentReaction = EmojiReactionType.request,
}) => {
  return useMemo(() => {
    // @debt partygoers can be undefined because our types are broken so check explicitly
    if (!showGrid || !userUid) return <div />;

    // @debt workaround, sometimes partygoers are duplicated but the new ones don't have id's
    const filteredPartygoers = partygoers.filter((partygoer) => partygoer?.id);

    return filteredPartygoers.map((partygoer) => {

      return (
        <MapPartygoerOverlay
          key={partygoer.id}
          partygoer={partygoer}
          venueId={venueId}
          myUserUid={userUid}
          totalRows={rows}
          totalColumns={columns}
          withMiniAvatars={withMiniAvatars}
        />
      );
    });
  }, [showGrid, partygoers, venueId, userUid, rows, columns, withMiniAvatars]);
};
