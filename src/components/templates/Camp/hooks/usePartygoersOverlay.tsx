import React, { useMemo } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";
import { ReactHook } from "types/utility";

import { MapPartygoerOverlay } from "../../../molecules/MapPartygoerOverlay";

interface UsePartygoersOverlay {
  showGrid?: boolean;
  userUid?: string;
  venueId: string;
  withMiniAvatars?: boolean;
  rows: number;
  columns: number;
  partygoers?: readonly WithId<User>[];
  setSelectedUserProfile: (user: WithId<User>) => void;
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
  setSelectedUserProfile,
}) => {
  return useMemo(
    () =>
      // @debt this can be undefined because our types are broken so check explicitly
      showGrid ? (
        partygoers?.map(
          (partygoer) =>
            partygoer?.id && ( // @debt workaround, sometimes partygoers are duplicated but the new ones don't have id's
              <MapPartygoerOverlay
                key={partygoer.id}
                partygoer={partygoer}
                venueId={venueId}
                myUserUid={userUid ?? ""} // @debt fix this to be less hacky
                totalRows={rows}
                totalColumns={columns}
                withMiniAvatars={withMiniAvatars}
                setSelectedUserProfile={setSelectedUserProfile}
              />
            )
        )
      ) : (
        <div />
      ),
    [
      showGrid,
      partygoers,
      venueId,
      userUid,
      rows,
      columns,
      withMiniAvatars,
      setSelectedUserProfile,
    ]
  );
};
