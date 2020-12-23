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
  partygoers: readonly WithId<User>[];
  setSelectedUserProfile: (user: WithId<User>) => void;
}

export type UsePartygoersReturn = (null | JSX.Element)[] | null;

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
  return useMemo(() => {
    if (!showGrid) return null;
    // @debt this can be undefined because our types are broken so check explicitly
    return partygoers.map((partygoer) => {
      if (!partygoer.id || !partygoer.data?.[venueId]) return null;
      // console.count();
      return (
        <MapPartygoerOverlay
          key={partygoer.id}
          partygoer={partygoer}
          position={partygoer?.data?.[venueId]}
          myUserUid={userUid} // @debt fix this to be less hacky
          totalRows={rows}
          totalColumns={columns}
          withMiniAvatars={withMiniAvatars}
          setSelectedUserProfile={setSelectedUserProfile}
        />
      );
    });
  }, [
    showGrid,
    partygoers,
    venueId,
    userUid,
    rows,
    columns,
    withMiniAvatars,
    setSelectedUserProfile,
  ]);
};
